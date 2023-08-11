# wiki-RestAPI-project

Build RESTful API endpoints from scratch.

# Technoloy used:
Express.js, Node.js, MongoDB, Mongoose, MongoDB Atlas (Cloud

## Authors

- [@kriswen](https://www.github.com/kris-wen)

## Database Connection

create an .env file in the root directory and restore the following env variables. 
`DBURL= <YourDBConnectionURL>
DBNAME= <YourDBName>
USERNAME= <YourDBUsername>
PASSWORD= <YourDBPassword>`

## Deployment

To install dependencies

```bash
  npm install
```

To start this project run

```bash
  node app.js
```

## Live URL

https://wiki-restapi-project.onrender.com/

# REST API

The REST API to the example app is described below.

## Get all articles

`GET /articles/`

Example:
`curl --location 'localhost:3000/articles/'`

## Get a specific article

`GET /aritles/articleTitle`

Example:
`curl --location 'localhost:3000/articles/DOM'`

## Create a new article

`POST /articles/`

Example: 
`curl --location 'localhost:3000/articles/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'title=New Title' \
--data-urlencode 'content=New Content'`

## Update an entire article (PUT)

`PUT /articles/articalTitle`

Example:
`curl --location --request PUT 'localhost:3000/articles/New Title' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'title=updated new  title' \
--data-urlencode 'content=updated new content'`

## Update a field within an article (PATCH)

`PATCH /articles/articleNTitle`

Example:
`curl --location --request PATCH 'localhost:3000/articles/kris wen' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'content=updated content'`

## DELETE all articles

`DELETE /articles/`

## DELETE an article

`DELETE /articles/articleTitle`


