import supabase, { supabaseUrl } from './supabase';

const storageUrl = `${supabaseUrl}/storage/v1/object/public/`;
const cabinBucket = 'cabin-images';

export async function getCabins() {
  //This returns a Promise so could be called resolved and rejected
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Could not load cabins data');
  }

  return data;
}

//Delete cabin row based on id
export async function deleteCabin(id) {
  //select().single() used to get reference to associated image file
  const { data, error } = await supabase
    .from('cabins')
    .delete()
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error(`Could not delete cabin with id: ${id}`);
  } else {
    console.table(data);
    await deleteCabinImage(data.imageUrl).catch((error) => {
      throw new Error(
        `Could not delete the image associated with the cabin called ${data.name}`
      );
    });
  }
}

/**
 *
 * @param {String} imageName - file name eg 'image.jpg
 * @param {File} imageFile - the image file to upload
 * @returns {Promise<Union>} - resolved - it returns an object {"path":file name,"id":image id string,"fullPath":bucket name/file name}, rejected - StorageError
 */
// function uploadCabinImage(imageName, imageFile) {
function uploadCabinImage(imageFile) {
  //If it's a url then we have been sent the wrong thing and so it already exists in the storage bucket
  if (imageFile.startsWith?.(storageUrl)) {
    const urlArray = imageFile.split('/');
    const filename = urlArray.pop();
    const filepath = `${urlArray.pop()}/${filename}`;
    return new Promise((resolve) =>
      resolve({
        data: { path: filename, fullPath: filepath, id: null },
        error: null,
      })
    );
  }
  //make sure the image name is formatted correctly for uploading
  const imgName = `${Math.random()}-${imageFile.name}`.replaceAll('/', '_');
  //upload the image to our supabase bucket called cabin-images and return the Promise
  return supabase.storage.from(cabinBucket).upload(imgName, imageFile);
}

function deleteCabinImage(imageName) {
  //check if it's the image url or image name
  if (imageName.startsWith?.(storageUrl)) {
    imageName = imageName.split('/').pop();
  }
  console.log(`cabin image to delete: ${imageName}`);
  return supabase.storage.from(cabinBucket).remove([imageName]);
}

function createCabin(cabinData) {
  return supabase.from('cabins').insert(cabinData);
}

async function updateCabin(id, cabinData) {
  return supabase
    .from('cabins')
    .update(cabinData)
    .eq('id', id)
    .select()
    .single();
}

//for some reason the numbers are being cast to string en-route to here so I'm going to clean it up to see if that is what is causing my 400 error
function cleanDataTypes(data) {
  let { maxCapacity, regularPrice, discount, name, description, imageUrl } =
    data;
  maxCapacity = +maxCapacity;
  regularPrice = +regularPrice;
  discount = +discount;
  return { name, maxCapacity, regularPrice, discount, description, imageUrl };
}

export async function createEditCabin(newCabin) {
  //We send different data through depending on if it's being edited/created and if it's being edited then we might have changed the image
  let { id, oldImage, ...cabinData } = newCabin;
  cabinData = cleanDataTypes(cabinData);
  console.log(`id: ${id}, oldImage:${oldImage}`);
  console.table(cabinData);

  if (oldImage) {
    //the image has been changed during editing so delete the old one so it doesn't become an orphan
    await deleteCabinImage(oldImage).catch((error) => console.log(error));
  }

  let imageUploadData = null;
  //upload the image to our supabase bucket called cabin-images, if it's already in the bucket it will be a url to an already existing one which this function will take care of
  const { data: uploadData, error: uploadError } = await uploadCabinImage(
    cabinData.imageUrl
  );
  if (uploadError) {
    console.error(uploadError);
    throw new Error(`Could not upload cabin image`);
  } else {
    console.log(`returned data from upload: ${JSON.stringify(uploadData)}`);
    console.log('Image successfully uploaded, creating cabin...');
    imageUploadData = uploadData;
  }

  //if upload is successful then create or update the cabin that has the uploaded image associated, if there is an id then it is an edit so update
  let createEditData = null;
  let createEditError = null;
  if (id) {
    //update cabin
    console.log('Updating Cabin....');
    const updateCabinData = {
      ...cabinData,
      imageUrl: `${storageUrl}${imageUploadData.fullPath}`,
    };
    const { data: updateData, error: updateError } = await updateCabin(
      id,
      updateCabinData
    );
    createEditData = updateData;
    createEditError = updateError;
    if (updateError) {
      throw new Error(`Could not update cabin ${id} - ${updateCabinData}`);
    }
  } else {
    //create cabin
    console.log(`Creating Cabin...`);
    const { data: createData, error: createError } = await createCabin({
      ...cabinData,
      imageUrl: `${storageUrl}${imageUploadData.fullPath}`,
    });
    createEditData = createData;
    createEditError = createError;
    if (createError) {
      //if unsuccessful then clear up our storage by removing the associated image which is now orphaned
      await deleteCabinImage(imageUploadData.path).catch((error) =>
        console.log(error)
      );
      throw new Error(`Could not add new cabin`);
    }
  }
  //Deal with the Promise from inserting the cabin
  if (!createEditError) {
    console.log('Cabin created successfully');
    console.table(createEditData);
  }

  return createEditData;
}
