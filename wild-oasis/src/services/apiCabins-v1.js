import supabase, { supabaseUrl } from './supabase';

const storageUrl = `${supabaseUrl}/storage/v1/object/public/`;
const cabinBucket = 'cabin-images';

export async function getCabins() {
  const { data, error } = await supabase
    .from('cabins')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    throw new Error('Could not load cabins data');
  }

  return data;
}

/**
 * Delete cabin row and associated image based on unique row id
 * @param {Number} id unique row id
 * @returns {CabinObject} {name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string}
 */
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
    console.log(
      `Cabin ${data.name} was successfully deleted, now removing associated image from storage...`
    );
    await deleteCabinImage(data.imageUrl).catch((error) => {
      throw new Error(
        `Could not delete the image associated with the cabin called ${data.name}`
      );
    });
  }
  return data;
}

/**
 * This will either attempt to upload an image file to the cabin-images storage bucket or reformat the string url of an already existing image file so that updateCabin or createCabin can function without being aware of which of the options is being dealt with
 * @param {FileObject[] | String} imageFile - the image File to upload or the string url to an already existing image in the storage bucket
 * @returns {CabinImageObject} {"path":file name,"id":image id string,"fullPath":bucket name/file name}
 */
async function uploadCabinImage(imageFile) {
  //If it's a url then we have been sent the wrong thing and so it already exists in the storage bucket
  if (imageFile.startsWith?.(storageUrl)) {
    const urlArray = imageFile.split('/');
    const filename = urlArray.pop();
    const filepath = `${urlArray.pop()}/${filename}`;
    console.log(
      `Image ${filename} already exists in storage, no need to upload...`
    );
    return { path: filename, fullPath: filepath, id: null };
  }
  //make sure the image name is formatted correctly for uploading
  const imgName = `${Math.random()}-${imageFile.name}`.replaceAll('/', '_');
  console.log(`Image ${imgName} is a new file and so will be uploaded...`);
  //upload the image to our supabase bucket called cabin-images, if it's already in the bucket it will be a url to an already existing one which this function will take care of
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(cabinBucket)
    .upload(imgName, imageFile);
  if (uploadError) {
    console.error(uploadError);
    throw new Error(`Could not upload cabin image`);
  } else {
    console.log('Image upload function successful');
    return uploadData;
  }
}

/**
 *
 * @param {String} imageName - either the full url of the image to be deleted or simply the name of the image
 * @returns {Union} - resolved - {
    data: FileObject[];
    error: null;
} | rejected - {
    data: null;
    error: StorageError;
}
 */
async function deleteCabinImage(imageName) {
  //check if it's the image url or image name
  if (imageName.startsWith?.(storageUrl)) {
    imageName = imageName.split('/').pop();
  }
  console.log(`cabin image to delete: ${imageName}`);
  // return supabase.storage.from(cabinBucket).remove([imageName]);
  const { data, error } = await supabase.storage
    .from(cabinBucket)
    .remove([imageName]);
  if (error) {
    console.log(error);
    throw new Error('Could not delete old image');
  } else {
    console.log(`Image ${data[0].name} removed`);
    return { data, error };
  }
}

/**
 * 
 * @param {CabinObject} cabinData - {name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string} 
 * @returns {Promise<Union>} resolved - {
    data: CabinObject;
    error: null;
} | rejected - {
    data: null;
    error: StorageError;
}
 */
function createCabin(cabinData) {
  return supabase.from('cabins').insert(cabinData).select().single();
}

/**
 * 
 * @param {Number} id - unique row id of cabin to be updated
 * @param {CabinObject} cabinData -{name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string} 
 * @returns  {Promise<Union>} resolved - {
    data: CabinObject;
    error: null;
} | rejected - {
    data: null;
    error: StorageError;
}
 */
function updateCabin(id, cabinData) {
  return supabase
    .from('cabins')
    .update(cabinData)
    .eq('id', id)
    .select()
    .single();
}

/**
 * for some reason the numbers are being cast to string en-route to here so I'm going to clean it up
 * @param {CabinObject} data  -{name: string, maxCapacity: string, regularPrice: string, discount: string, description: string, imageUrl: string}
 * @returns {CabinObject}  -{name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string}
 */
function cleanDataTypes(data) {
  let { maxCapacity, regularPrice, discount, name, description, imageUrl } =
    data;
  maxCapacity = +maxCapacity;
  regularPrice = +regularPrice;
  discount = +discount;
  return { name, maxCapacity, regularPrice, discount, description, imageUrl };
}

async function cabinUpdater(id, cabinData, oldImage = null) {
  if (oldImage) {
    //the image has been changed during editing so delete the old one so it doesn't become an orphan
    await deleteCabinImage(oldImage);
  }

  const { data: updateData, error: updateError } = await updateCabin(
    id,
    cabinData
  );
  if (updateError) {
    throw new Error(`Could not update cabin ${id}`);
  } else {
    console.log(`Cabin "${updateData.name}" successfully updated`);
    return updateData;
  }
}

async function cabinCreator(cabinData, imageData) {
  const { data: createData, error: createError } = await createCabin({
    ...cabinData,
    imageUrl: `${storageUrl}${imageData.fullPath}`,
  });
  if (createError) {
    //if unsuccessful then clear up our storage by removing the associated image which is now orphaned
    const { error: deleteError } = await deleteCabinImage(imageData.path);
    if (deleteError) {
      //we won't throw an error as it is just part of the create new cabin failing which throws an error of it's own
      console.error('Could not remove image when creating a new cabin failed');
    }
    throw new Error(`Could not add new cabin`);
  } else {
    console.log(`Cabin "${createData.name}" successfully created`);
    return createData;
  }
}

/**
 * If id (unique row id) is included this will update a cabin row otherwise it will add a new cabin to the database.
 * if oldImage (image name or storage url) is included it will delete that image before uploading the new image
 * @param {ExtendedCabinObject} newCabin -{name: string, maxCapacity: number | string, regularPrice: number | string, discount: number | string, description: string, imageUrl: FIleObject[], [...id: number, oldImage: string]}
 * @returns {CabinObject} {name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string}
 */
export async function createEditCabin(newCabin) {
  //We send different data through depending on if it's being edited/created and if it's being edited then we might have changed the image
  let { id, oldImage, ...cabinData } = newCabin;
  cabinData = cleanDataTypes(cabinData);

  let imageUploadData = null;
  //upload the image to our supabase bucket called cabin-images, if it's already in the bucket it will be a url to an already existing one which this function will take care of
  imageUploadData = await uploadCabinImage(cabinData.imageUrl);

  //if upload has not thrown an error then create or update the cabin that has the uploaded image associated, if there is an id then it is an edit so update
  let createEditData = null;
  if (id) {
    //update cabin
    console.log(`Updating Cabin....${id}`);
    createEditData = await cabinUpdater(
      id,
      {
        ...cabinData,
        imageUrl: `${storageUrl}${imageUploadData.fullPath}`,
      },
      oldImage
    );
  } else {
    //create cabin
    console.log(`Creating Cabin...`);
    createEditData = await cabinCreator(
      {
        ...cabinData,
        imageUrl: `${storageUrl}${imageUploadData.fullPath}`,
      },
      imageUploadData
    );
  }

  return createEditData;
}
