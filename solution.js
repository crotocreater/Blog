import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

// In-memory data store
let posts = [];

var lastId;
var allPostsSize;

const client = {
  user: "postgres",
  host: "localhost", 
  database: "Posts",
  password: "hoang2k5@",
  port: 3000,
}

const db = new pg.Client(client);

db.connect();



// ham database posts


async function setLastId(){
  db.query("select count(id) from postscontent", (err, res)=>{
  if(err){
    console.log(err.message);
  }else{
    allPostsSize = res.rows[0].count;
  }
  });
}

async function setLastIdkey(){
  db.query("select count(id) from postscontent", (err, res)=>{
  if(err){
    console.log(err.message);
  }else{
    lastId = parseInt(res.rows[0].count);
  }
  });
}



async function newPosts(param){
  db.query("insert into postscontent values ($1, $2, $3, $4, $5)", [param.id, param.title, param.content, param.author, param.date]);
}

async function editPosts(param){
  db.query("update postscontent set title = $1, contentposts = $2, postsdate = $3 where id = $4", [param.title, param.content,  param.date, param.id]);
}

async function deletePosts(param){
  db.query("delete from postscontent where id = $1", [param.id])
}


// ham database user

//login 
async function checkUser(param){
  let user
}

// sign in 

// * cải tiến database

async function setNewUser(param){
  db.query("insert into useraccount values ($1, $2, $3, $4)", [param.id, param.username, param.passwork, param.email]);
}

async function getlastuserid(){
  return parseInt(db.query("select count(id) from useraccount")[0].count);
}

app.post("/newuser", async (req, res)=>{
  try{
    console.log(req.body);
    res.status(201).json({key: true});
  } catch (error) {
    
  }
});



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET all posts
app.get("/posts",async (req, res) => {
  try {
    await getFullPosts();
    await setLastId();
    await setLastIdkey();
    res.json(posts);

  } catch (error) {
    console.log(error);
  }
});

// GET a specific post by id
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// POST a new post
app.post("/posts", async (req, res) => {
  const newId = lastId += 1;
  const post = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  };
  try {
    await newPosts(post);
    await getFullPosts(); 
    res.status(201).json(posts);
  } catch (error) {
    console.log(error)
  }
});

// PATCH a post when you just want to update one parameter
app.patch("/posts/:id", async (req, res) => {
  const newId = parseInt(req.params.id);
  const post = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  };
  try {
    await editPosts(post);
    await getFullPosts(); 
    res.status(201).json(posts);
  } catch (error) {
    console.log(error)
  }
});

// DELETE a specific post by providing the post id
app.delete("/posts/:id",async (req, res) => {
  try {
    let param = req.params;
    if(param.id > lastId || param.id < 0){
      res.status(404).json({message : "no search element"});
    }else{
      await deletePosts(param);
      await getFullPosts();
      await setLastId();
      res.status(201).json(posts);
    }
  } catch (error) {
    console.log(error)
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
