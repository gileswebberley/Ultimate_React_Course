import supabase from './supabase';

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
