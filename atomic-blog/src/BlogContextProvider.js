import { createContext, useContext, useState } from 'react';
import { faker } from '@faker-js/faker';

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

//Here we will create our context which we export at the bottom
const BlogContext = createContext();
//Now we are creating our first custom Context Provider which will hold all of it's own state rather than how it works in App-v1
function BlogContextProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    // The value is an object that essentially contains all of the props that are passed down but in key:value pairs
    <BlogContext.Provider
      value={{
        posts: searchedPosts,
        onClearPosts: handleClearPosts,
        onAddPost: handleAddPost,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

//To nicely encapsulate this context we'll create the custom hook which passes back the context itself
function useBlogContext() {
  const context = useContext(BlogContext);
  //to ensure it's only accessed within the scope of the provider we'll throw an error
  if (context === undefined)
    throw new Error(
      'useBlogContext was used outside of the scope of the BlogContextProvider component'
    );
  return context;
}
export { BlogContextProvider, useBlogContext };
