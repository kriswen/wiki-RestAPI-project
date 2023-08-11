import express from "express";
//import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Save credentials using .env
dotenv.config();
const DBURL = process.env.DBURL;
const DBName = process.env.DBNAME;
const DBUser = process.env.USERNAME;
const DBPass = process.env.PASSWORD;

// Create an express app and assign port
const app = express();
const port = 3000;

// Set the view engine to ejs
//app.set("view engine", "ejs");

// parsing URL-encoded data using
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static("public"));

//MongoDB connection
//mongoose.connect(`mongodb://localhost:27017/wikiDB`, { useNewUrlParser: true });
mongoose.connect(`mongodb+srv://${DBUser}:${DBPass}@${DBURL}${DBName}`, {
  useNewUrlParser: true,
});

//create schema for MongoDB collection
const articleSchema = {
  title: String,
  content: String,
};

//create Model using the schema
const Article = mongoose.model("Article", articleSchema); //mongoose will create "articles" collection from "Article" from the first paremeter

//chainable route handlers using Express.js for /article
app
  .route("/articles")
  //GET /articles route
  .get(async function (req, res) {
    //read from database
    await Article.find()
      .then(function (foundArticles) {
        //send back JSON results to the client
        if (foundArticles) {
          res.status(200).send(foundArticles);
        } else {
          res.status(200).send("No article in the database");
        }
      })
      .catch(function (error) {
        //console.log(error);
        res.status(404).send(error);
      });
  })
  //POST /articles route
  .post(async function (req, res) {
    //get the x-wwww.form-urlencoded request title and request content
    //create document and save into DB
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    //save to db with error reporting
    try {
      await newArticle.save(); //async & await
      res.send("article added succussfully"); //so the POST request will complete
    } catch (error) {
      res.send(error);
    }
  })
  //DELETE /articles route
  .delete(function (req, res) {
    Article.deleteMany({})
      .then(function () {
        res.send("All articles deleted sucesfully.");
      })
      .catch(function (error) {
        res.send(error);
      });
  }); //ends with semicolon

// //GET route will return all articles
// app.get("/articles", async function (req, res) {
//   //read from database
//   await Article.find()
//     .then(function (foundArticles) {
//       //send back JSON results to the client
//       res.status(200).send(foundArticles);
//     })
//     .catch(function (error) {
//       //console.log(error);
//       res.status(404).send(error);
//     });
// });

// //POST route for creating one new article
// app.post("/articles", async function (req, res) {
//   //get the x-wwww.form-urlencoded request title and request content
//   //create document and save into DB
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });
//   //save to db with error reporting
//   try {
//     await newArticle.save(); //async & await
//     res.send("article added succussfully"); //so the POST request will complete
//   } catch (error) {
//     res.send(error);
//   }
// });

// //DELETE route
// app.delete("/articles", function (req, res) {
//   Article.deleteMany({})
//     .then(function () {
//       res.send("All articles deleted sucesfully.");
//     })
//     .catch(function (error) {
//       res.send(error);
//     });
// });

////////////////Request targeting specific article/////////////////////
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    const requestedArticleTitle = req.params.articleTitle;
    // Use a case-insensitive regex to find the article
    const updateArticle = Article.findOne({
      title: { $regex: new RegExp(requestedArticleTitle, "i") },
    })
      .then((foundArticle) => {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send(`No article found with name ${requestedArticleTitle}`);
        }
      })
      .catch((error) => {
        res.send(error);
      });
  })
  // meant to replace entire article resource
  .put((req, res) => {
    const requestedArticleTitle = req.params.articleTitle;
    //console.log("title:" + req.body.title);
    //console.log("content:" + req.body.content);
    Article.findOneAndUpdate(
      { title: { $regex: new RegExp(requestedArticleTitle, "i") } }, //filter condtions - case insensitive
      { title: req.body.title, content: req.body.content }, // actual update
      { overwrite: true } //overwrite moogoose default behavior,
    )
      .then((foundArticle) => {
        if (foundArticle) {
          res.send("article updated.");
        } else {
          res.status(400).send("update failed, no article found");
        }
      })
      .catch((error) => {
        res.send(error);
      });
  })
  //update part of the specific article
  .patch((req, res) => {
    Article.findOneAndUpdate(
      { title: { $regex: new RegExp(req.params.articleTitle, "i") } }, //filter condtions - case insensitive
      { $set: req.body } //only the field with new value; req.body = [{<field1>: <value1>, ...}]
    )
      .then((foundArticle) => {
        if (foundArticle) {
          res.send("article updated.");
        } else {
          res.status(400).send("update failed, no article found");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .delete((req, res) => {
    Article.findOneAndDelete(
      { title: { $regex: new RegExp(req.params.articleTitle, "i") } } //filter condtions - case insensitive
    )
      .then((foundArticle) => {
        if (foundArticle) {
          res.send("article deleted.");
        } else {
          res.status(400).send("deletion failed, no article found");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

//start server on port
app.listen(port, function (req, res) {
  console.log(`Server started on port ${port}`);
});
