//looking at Objects and arrays - see below data definition for notes and learnings

/*we're using Quokka to run js within vscode - to run it for this file use the Settings (cog wheel bottom left) and Command Palette then 'run on current file.
It adds a little icon to the left pane which allows you to inspect
*/

const data = [
  {
    id: 1,
    title: 'The Lord of the Rings',
    publicationDate: '1954-07-29',
    author: 'J. R. R. Tolkien',
    genres: [
      'fantasy',
      'high-fantasy',
      'adventure',
      'fiction',
      'novels',
      'literature',
    ],
    hasMovieAdaptation: true,
    pages: 1216,
    translations: {
      spanish: 'El señor de los anillos',
      chinese: '魔戒',
      french: 'Le Seigneur des anneaux',
    },
    reviews: {
      goodreads: {
        rating: 4.52,
        ratingsCount: 630994,
        reviewsCount: 13417,
      },
      librarything: {
        rating: 4.53,
        ratingsCount: 47166,
        reviewsCount: 452,
      },
    },
  },
  {
    id: 2,
    title: 'The Cyberiad',
    publicationDate: '1965-01-01',
    author: 'Stanislaw Lem',
    genres: [
      'science fiction',
      'humor',
      'speculative fiction',
      'short stories',
      'fantasy',
    ],
    hasMovieAdaptation: false,
    pages: 295,
    translations: {},
    reviews: {
      goodreads: {
        rating: 4.16,
        ratingsCount: 11663,
        reviewsCount: 812,
      },
      librarything: {
        rating: 4.13,
        ratingsCount: 2434,
        reviewsCount: 0,
      },
    },
  },
  {
    id: 3,
    title: 'Dune',
    publicationDate: '1965-01-01',
    author: 'Frank Herbert',
    genres: ['science fiction', 'novel', 'adventure'],
    hasMovieAdaptation: true,
    pages: 658,
    translations: {
      spanish: '',
    },
    reviews: {
      goodreads: {
        rating: 4.25,
        ratingsCount: 1142893,
        reviewsCount: 49701,
      },
    },
  },
  {
    id: 4,
    title: "Harry Potter and the Philosopher's Stone",
    publicationDate: '1997-06-26',
    author: 'J. K. Rowling',
    genres: ['fantasy', 'adventure'],
    hasMovieAdaptation: true,
    pages: 223,
    translations: {
      spanish: 'Harry Potter y la piedra filosofal',
      korean: '해리 포터와 마법사의 돌',
      bengali: 'হ্যারি পটার এন্ড দ্য ফিলোসফার্স স্টোন',
      portuguese: 'Harry Potter e a Pedra Filosofal',
    },
    reviews: {
      goodreads: {
        rating: 4.47,
        ratingsCount: 8910059,
        reviewsCount: 140625,
      },
      librarything: {
        rating: 4.29,
        ratingsCount: 120941,
        reviewsCount: 1960,
      },
    },
  },
  {
    id: 5,
    title: 'A Game of Thrones',
    publicationDate: '1996-08-01',
    author: 'George R. R. Martin',
    genres: ['fantasy', 'high-fantasy', 'novel', 'fantasy fiction'],
    hasMovieAdaptation: true,
    pages: 835,
    translations: {
      korean: '왕좌의 게임',
      polish: 'Gra o tron',
      portuguese: 'A Guerra dos Tronos',
      spanish: 'Juego de tronos',
    },
    reviews: {
      goodreads: {
        rating: 4.44,
        ratingsCount: 2295233,
        reviewsCount: 59058,
      },
      librarything: {
        rating: 4.36,
        ratingsCount: 38358,
        reviewsCount: 1095,
      },
    },
  },
];

function getBooks() {
  return data;
}

function getBook(id) {
  return data.find((d) => d.id === id);
}

//Destructuring
//----------------------------------------------------------------------

//first we will get a book object from the data array
const book = getBook(1);
//now we can use the Quokka which will list the following variable...
//book;

//then use object destructuring to extract the info we want which is done by using the property name within the object
//which will become variable names for use within our code rather than having to do eg const title = book.title; const author = book.author etc
const { title, author, publicationDate, pages } = book;
//now we can refer to title rather than having to define it eg const title = book.title
console.log(title, author, publicationDate, pages);

//to use destructuring with arrays it is similar but we use square brackets (like when you define an array)
//so here rather than having to do something like firstArrayItem = book.genres[0]; secondArrayItem = book.genres[1] we can do
const [firstArrayItem, secondArrayItem] = book.genres;
console.log(firstArrayItem, secondArrayItem);

//REST AND SPREAD -
//----------------------------------------------------------------------

//to get the REST of the genres that are available within the book.genres array as an array of their own you can use the Rest-Operator
//which is an ellipses follwed by the name you wish to associate it. A Rest must be the last declaration within the destructuring statement
//so let's do the same as above but with the rest of the genres held in an array called otherListedGenres and firstArrayItem now called firstGenre etc
const [firstGenre, secondGenre, ...otherGenres] = book.genres;
console.log(firstGenre, secondGenre, otherGenres[0], otherGenres);

//Now for a SPREAD which is essentially used to unpack the array (or object) which was passed back to us from the Rest-Operator
//so as an example rather than having firstGenre and secondGenre as individual listings followed by an array of the rest of the genres
//we could instead SPREAD the rest into individual listings of their own like so
console.log(firstGenre, secondGenre, ...otherGenres);
//or perhaps we want to create a new array without the secondGenre but with an added one as the first entry and firstGenre as the final entry
const spreadGenreExample = ['additional genre', ...otherGenres, firstGenre];
console.log(spreadGenreExample);

//REST and SPREAD ALSO WORKS WITH OBJECTS
//To add a new property to our book object let's SPREAD our book object into a new object and add the property we want
const updatedBook = { ...book, moviePublicationDate: '2001-12-19' };
console.log(updatedBook);

//When an object is defined, as in updatedBook, then remember that the last definition of any property is the one that will be stored
//which means we can change any existing properties by Spreading out the object and then redefining the property we wish to change
//for example to change the publication date from 1954-07-29 to a year later in our new object we could do.....
const laterPublishedBook = { ...book, publicationDate: '1955-07-29' };
//if we had ...book listed as the second object it would not have a changed publication date,
//it's only because we have essentially re-listed the publicationDate property as shown below
const unchangedPublicationDateExample = {
  publicationDate: '1955-07-29',
  ...book,
};
console.log(
  book.publicationDate,
  laterPublishedBook.publicationDate,
  unchangedPublicationDateExample.publicationDate
);

//ARROW FUNCTIONS
//----------------------------------------------------------------------

/*
in place of a simple function like
function getYear(str) {
  return str.split('-')[0]
}
we can instead write a 'function expression' instead of declaring the function as above.
simply save it into a variable, with arguments recieved in the parenthesis and the return value after the =>
unless you need more working before the return statement; in this case you would place the function inside {} and use
the return keyword

FUNCTIONS MUST BE INITIALISED BEFORE THEY ARE AVAILABLE TO USE IN YOUR CODE!!
*/
const getYear = (str) => str.split('-')[0];
console.log(getYear(publicationDate));

//If you wish to return an object simply put it inside parenthesis (to avoid the curly braces being seen as a declaration block) eg

const allBooks = getBooks();
//see a bit further down for the map() functionality description
const basicInfo = allBooks.map((eachBook) => ({
  title: eachBook.title,
  author: eachBook.author,
}));
console.log(basicInfo);

//TEMPLATE LITERALS
//----------------------------------------------------------------------

//Used to place script directly into strings (like the time within our 01-Pure-React project)
//it is not a single quotation mark btw, it is the ` (back-tick) and then ${} to contain the script element eg
const templateLiteralBook = `${title} was written by ${author} in the year ${getYear(
  publicationDate
)}`;
console.log(templateLiteralBook);

//TERNARY OPERATOR
//----------------------------------------------------------------------

//Same as usual......
const pagesTernary =
  pages > 1000
    ? 'The book has more than one thousand pages'
    : 'The book has less than one thousand pages';
console.log(pagesTernary);

//SHORT CIRCUITING WITH LOGICAL OPERATORS
//----------------------------------------------------------------------

//When using logical AND (&&) the first false value (false, 0, '', null, undefined) is returned without checking the following values
console.log(true && 'second value');
console.log(false && 'second value');
console.log('first value' && 'second value');

//When using logical OR (||) it is the other way around so you can use it to set default values, for example
const hasSpanishTranslation = book.translations.spanish || 'No Translation';
console.log(hasSpanishTranslation);

//If OR comes across a false equivalent value (eg if there is a value of zero which is actually a valid answer it will see it as invalid)
//imagine we check the reviews count and there is zero reviews, that's the data that we want but instead the OR operator simply sees it as false
//This is why there is a Knowledge Coalescing operator (??) which will not consider 0 or an '' as false (only null or undefined)

//OPTIONAL CHAINING OPERATOR (?.) use when unsure of the data structures you might be recieving
//----------------------------------------------------------------------

//This is used to capture undefined or null variables rather than throw an error, and if used alongside the KNOWLEDGE COALESCING OPERATOR
//we can safely add a default. As an example the course uses the review counts as sometimes there is not both of the reviews objects (as seen in book 3)
//To use it we'll write a quick function as an example...
function totalReviewsCountFixed(b) {
  //lots of the books have reviews from both Goodreads and Librarything, just not all have a Librarything object
  const goodreadsTotal = b.reviews.goodreads.reviewsCount; //this is safe when the data is definitely existing but not if undefined
  //so when librarything does not exist the code would try to access undefined.reviewsCount which would throw an error so we check first
  const librarythingTotal =
    b.reviews.librarything
      ?.reviewsCount /*this would return NaN so we add... */ ?? 0;
  return goodreadsTotal + librarythingTotal;
}

function totalReviewsCountFaulty(b) {
  //lots of the books have reviews from both Goodreads and Librarything, just not all have a Librarything object
  const goodreadsTotal = b.reviews.goodreads.reviewsCount; //this is safe when the data is definitely existing but not if undefined
  //but this will throw an error and all code below it's call will fail to run
  const librarythingTotal = b.reviews.librarything.reviewsCount;
  return goodreadsTotal + librarythingTotal;
}

console.log(totalReviewsCountFixed(getBook(3)));
//[ERROR] console.log(totalReviewsCountFaulty(getBook(3))); Cannot read properties of UNDEFINED (reading librarything.reviewsCount)

//THE ARRAY MAP METHOD - does not mutate an array but instead returns a new one
//----------------------------------------------------------------------

//map(callbackFunction) will run the callbackFunction on each element of the array it is run on eg...
const exampleArray = [1, 2, 3, 4, 5];
const arrayMapExample = exampleArray.map(
  (currentElement) => currentElement * 2
);
console.log(arrayMapExample, exampleArray);

//so we could use that to create an array of the book titles for example
const titlesArray = allBooks.map((eachBook) => eachBook.title);
console.log(titlesArray);

//THE ARRAY FILTER METHOD - does not mutate an array but instead returns a new one
//----------------------------------------------------------------------

const titleOfFantasyBooksOver500PagesLong = allBooks
  .filter((eachBook) => eachBook.pages > 500)
  .filter((eachBook) => eachBook.genres.includes('fantasy'))
  .map((eachBook) => eachBook.title); //remember you can chain calls

console.log(titleOfFantasyBooksOver500PagesLong);

//THE ARRAY REDUCE METHOD - does not mutate an array but instead returns a single value (can be an array, an object, a number etc)
//----------------------------------------------------------------------
//it takes the form reduce((objectBeingBuilt, eachElement) => function, objectBeingBuiltStartingState)

//essentially use it to compress an array's worth of values into a single variable - a simple example would be to add up the total number
//of reviews that all of the books have recieved (using our function from the earlier lesson about the Knowledge Coalescence)

const totalNumberOfReviewsOfAllBooks = allBooks.reduce(
  (numberBeingBuilt, eachBook) =>
    numberBeingBuilt + totalReviewsCountFixed(eachBook),
  0
);
console.log(totalNumberOfReviewsOfAllBooks);

//THE ARRAY SORT METHOD - DOES MUTATE an array!!
//----------------------------------------------------------------------
//if the function returns a negative value then a will be sorted to be before b, otherwise it will be reversed
//so a-b will sort numbers in an ascending way whilst b-a will sort in a descending way eg
const arrayForSorting = [2, 7, 4, 9, 1, 6];
arrayForSorting.sort((a, b) => a - b);
console.log(arrayForSorting);
arrayForSorting.sort((a, b) => b - a);
console.log(arrayForSorting);

//To avoid mutating the original array (good idea) you can create a copy by using the slice() function with empty brackets eg
const arrayToCopy = [2, 5, 8, 1, 9, 3];
const ascendingArray = arrayToCopy.slice().sort((a, b) => a - b);
console.log(arrayToCopy, ascendingArray);

//let's now use it on the books array to sort by page number
const booksSortedByPagesDescending = allBooks
  .slice()
  .sort((firstBook, secondBook) => secondBook.pages - firstBook.pages);
console.log(
  booksSortedByPagesDescending.map(
    (eachBook) =>
      eachBook.title + ' has ' + eachBook.pages.toString() + ' pages'
  )
);
