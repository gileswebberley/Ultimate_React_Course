import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  //This returns a Promise so could be called resolved and rejected
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Could not load cabins data');
  }

  return data;
}

//we must adjust our RLS policy to allow this
export async function deleteCabin(id) {
  const { error } = await supabase.from('cabins').delete().eq('id', id);
  if (error) {
    console.error(error);
    throw new Error(`Could not delete cabin with id: ${id}`);
  }
}

export async function createCabin(newCabin) {
  //make sure the image name is formatted correctly for uploading
  const imgName = `${Math.random()}-${newCabin.imageUrl.name}`.replaceAll(
    '/',
    '_'
  );
  const imgPath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imgName}`;

  //upload the image to our supabase bucket called cabin-images
  const { error: uploadError } = await supabase.storage
    .from('cabin-images')
    .upload(imgName, newCabin.imageUrl);
  if (uploadError) {
    console.error(uploadError);
    throw new Error(`Could not upload cabin image`);
  } else {
    console.log('Image successfully uploaded, creating cabin...');
  }

  //if successful then create the cabin that has this image and pass it the bucket url
  const { data, error } = await supabase
    .from('cabins')
    .insert([{ ...newCabin, imageUrl: imgPath }])
    .select();
  if (error) {
    console.error(error);
    //if unsuccessful then clear up our storage by removing the associated image which is now orphaned
    await supabase.storage
      .from('cabin-images')
      .remove([imgName])
      .catch((error) => console.log(error));

    throw new Error(`Could not add new cabin`);
  } else {
    console.log('Cabin created successfully');
  }

  return data;
}
