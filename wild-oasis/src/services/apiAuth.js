import supabase from './supabase';

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  //console.table(data);
  return data;
}

export async function getCurrentUser() {
  //this checks whether there is a current session (ie whether there is a local token)
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) return null;

  //then we can get our user data again from supabase rather than trust the local data
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  //console.table(data);
  return data?.user ?? null;
}
