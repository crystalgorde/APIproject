require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

//Database
const database = require("./database");


//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
 {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
   useCreateIndex: true
 }
).then(() => console.log("Connection Established"));


//GET METHOD

/*
Route               /
description         get all the Books
access              PUBLIC
Parameter           NONE
Methods             GET
*/

//root route
booky.get("/", (req, res) => {
  return res.json({books: database.books});
});

/*
Route               /is
description         get specific book using ISBN
access              PUBLIC
Parameter           isbn
Methods             GET
*/

booky.get("/is/:isbn", (req, res) => {
  return getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if(getSpecificBook.lenght === 0) {
    return res.json({error: `No book found for the ISBN: ${req.params.isbn}`});
  }

  return res.json({book: getSpecificBook});
});

/*
Route               /c
description         get specific book using category
access              PUBLIC
Parameter           category
Methods             GET
*/


booky.get("/c/:category", (req, res) => {
  return getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  );

  if(getSpecificBook.lenght === 0) {
    return res.json({error: `No book found for the category: ${req.params.category}`});
  }

  return res.json({book: getSpecificBook});
});


/*
Route               /lang
description         get specific book using language
access              PUBLIC
Parameter           language
Methods             GET
*/

booky.get("/lang/:language", (req, res) => {
  return getSpecificBook = database.books.filter(
    (book) => book.language.includes(req.params.language)
  );

  if(getSpecificBook.lenght === 0) {
    return res.json({error: `No book found for the language: ${req.params.language}`});
  }


  return res.json({book: getSpecificBook});
});


/*
Route               /author
description         get all authors
access              PUBLIC
Parameter           none
Methods             GET
*/

booky.get("/author", (req, res) => {
  return res.json({authors: database.author});
});

/*
Route               /author/book
description         specific author using isbn
access              PUBLIC
Parameter           isbn
Methods             GET
*/

booky.get("/author/book/:isbn", (req, res) => {
  return getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.lenght === 0) {
    return res.json({error: `No author found for the category: ${req.params.isbn}`});
  }

  return res.json({authors: getSpecificAuthor});
});


/*
Route               /author/book
description         specific author using id
access              PUBLIC
Parameter           id
Methods             GET
*/

booky.get("/author/book/:id", (req, res) => {
  return getSpecificAuthor = database.author.filter(
    (author) => author.id(req.params.id)
  );

  if(getSpecificAuthor.lenght === 0) {
    return res.json({error: `No author found for the ID: ${req.params.id}`});
  }

  return res.json({authors: getSpecificAuthor});
});


/*
Route               /publication
description         get all publoications
access              PUBLIC
Parameter           none
Methods             GET
*/

booky.get("/publication", (req, res) => {
  return res.json({publication: database.publication});
});

/*
Route               /publication/id
description         get specific publoication using ID
access              PUBLIC
Parameter           ID
Methods             GET
*/

booky.get("/publication/id/:id", (req,res) => {
  return getSpecificPublication = database.publication.filter(
    (publication) => publication.id(req.params.id)
  );
  if (getSpecificPublication.lenght === 0) {
    return res.json({error: `No publication found for the ID: ${req.params.id}`});
  }

  return res.json({publication: getSpecificPublication});
});


/*
Route               /publication/iS/:isbn
description         get specific publoication using ISBN
access              PUBLIC
Parameter           ISBN
Methods             GET
*/

booky.get("/publication/id/:isbn", (req,res) => {
  return getSpecificPublication = database.publication.filter(
    (publication) => publication.books.includes(req.params.isbn)
  );
  if (getSpecificPublication.lenght === 0) {
    return res.json({error: `No publication found for the ISBN: ${req.params.isbn}`});
  }

  return res.json({publication: getSpecificPublication});
});


//POST METHOD

/*
Route               /book/new
description        add new book
access              PUBLIC
Parameter           none
Methods             GET
*/

booky.post("/book/new", (req,res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedbooks: database.books});
});


/*
Route               /author/new
description        add new author
access              PUBLIC
Parameter           none
Methods             POST
*/

booky.post("/author/new", (req,res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json({updatedAuthors: database.author});
});


/*
Route               /publication/new
description        add new publication
access              PUBLIC
Parameter           none
Methods             POST
*/

booky.post("/publication/new", (req,res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json({updatedPublication: database.publication});
});

/*
Route               /publication/update/book
description         update /add
access              PUBLIC
Parameter           isbn
Methods             PUT
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
  //Update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubID) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publications = req.body.pubID;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Publications updated successfully",
    }
  );
})

/*
Route               /book/delete
description         delete a book
access              PUBLIC
Parameter           isbn
Methods             DELETE
*/

booky.delete("/book/delete/:isbn", (req, res) => {
  //Whichever book that does not match with the isbn, send it to updatedBookDatabase and the rest will be filtered out
  const updatedBookDatabase = database.books.filter(
    (book) = book.ISBN !== req.params.isbn
  )
  database.books = updatedBookDatabase;

  return res.json({books: database.books});
});


/*
Route               /author/delete/
description         delete a author from book
access              PUBLIC
Parameter           isbn, authorID
Methods             DELETE
*/

booky.delete("/author/delete/:isbn/:authorID", (req, res) => {
  //Update the book Database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorID)
      );
      book.author = newAuthorList;
      return;
    }
  });



/*
Route               /book/delete/author
description         Delete author from book and related book from author
access              PUBLIC
Parameter           isbn, authorID
Methods             DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorID", (req, res) => {
  //Update the book Database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorID)
      );
      book.author = newAuthorList;
      return;
    }
  });

   //Update the author database
   database.author.forEach((eachAuthor) => {
     if(eachAuthor.id === parseInt(req.params.author.ID)) {
       const newBookList = eachAuthor.books.filter(
         (book) => book !== req.params.isbn
       );
       eachAuthor.books = newBookList;
       return;
     }
   });

   return res.json({
     book: database.books,
     author: database.author,
     message: "Author was deleted"
   });
});


booky.listen(3000, () => {
  console.log("Sever is up and running");
})
