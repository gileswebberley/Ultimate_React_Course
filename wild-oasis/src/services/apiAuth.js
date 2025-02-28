import supabase from './supabase';

export async function signUp({ email, password, fullName }) {
  //Thanks to Hiroshi on Udemy for this solution to be able to create a user without signing in as them :)
  // Save the current session before signing up a new user
  const { data: savedSessionData } = await supabase.auth.getSession();
  const { data: signupee, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: '',
      },
    },
  });
  // Log the entire response for debugging
  console.log(`'Sign-up response:' ${signupee?.user}, ${error} }`);
  //If there was a previously authenticated user, restore their session
  // This action should be placed right after signUp, otherwise the authError will stop the restore
  if (savedSessionData) {
    await supabase.auth.setSession(savedSessionData.session);
  }
  // Handle errors
  let authError = null;
  if (signupee.user && !signupee.user.identities.length) {
    authError = {
      name: 'AuthApiError',
      message: 'This email has already been registered',
    };
  } else if (error) {
    authError = {
      name: error.name,
      message: error.message,
    };
  }
  if (authError) throw new Error(authError.message);
  // return user;
  //this is to keep the data formatted the same as a simple call to signUp()
  return signupee;
}

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

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Unable to log out because: ${error.message}`);
  }
}

export async function getCurrentUser() {
  //this checks whether there is a current session (ie whether there is a local token)
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) return null;

  //then we can get our user data again from supabase rather than trust the local data
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    //if a user is removed whilst logged in we were not being chucked off the site so rather than throwing an error...
    return null;
    // throw new Error(error.message);
  }

  //console.table(data);
  return data?.user ?? null;
}
