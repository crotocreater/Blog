import express, { response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import bcrypt, { hash } from 'bcrypt';

const app = express();
const port = 8080;
const saltRounds = 10;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// default app
var status = 'no';
var user = {};




const client = {
  user: "postgres",
  host: "localhost", 
  database: "Posts",
  password: "hoang2k5@",
  port: 3000,
}

const db = new pg.Client(client);

db.connect();

// about user
app.get("/login", (req,res)=>{
  res.render("partials/login.ejs",
     {
      title: "Login",
      submit: "Login",
      key: 1
     });
});
app.get("/sign-in", (req,res)=>{
  res.render("partials/login.ejs",
    {
     title: "Sign-in",
     submit: "Sign-in"
    });
});



// sign 


app.post('/sign-in/user', async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.passwork;

    // Kiểm tra xem email đã tồn tại chưa
    const isCheck = await db.query("SELECT * FROM usersaccount WHERE email = $1", [email]);
    if (isCheck.rows.length > 0) {
      // Gửi phản hồi lỗi cho client
      return res.status(400).json({ message: "Email đã tồn tại!!!" });
    }else{
          // Lấy số lượng người dùng hiện có
    const countResult = await db.query("SELECT COUNT(id) FROM usersaccount");
    const count = parseInt(countResult.rows[0].count, 10);

    // Tạo dữ liệu người dùng mới
    const data = {
      id: count + 1,
      email : email,
      password : password,
      username : username,
      avatar: '../image/avatardefault.jpg',
      status: 'submitted',
      role: 'user'
    };

    // ma hoa mat khau nguoi dung
      bcrypt.hash(data.password, saltRounds, async (err, hash)=>{
        if(err){
          res.status(500).json({message: "err: "+ err});
        }else{
            await db.query('INSERT INTO usersaccount (id, email, password, username, avatar, status, role) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
            data.id,
            `${data.email}`,
            `${hash}`,
            `${data.username}`,
            `${data.avatar}`,
            `${data.status}`,
            `${data.role}`
          ]);
          // Gửi phản hồi thành công cho client
          status = data.role;
          user.username = data.username;
          user.avatar = data.avatar;
          user.id = data.id;
          res.status(200).redirect('/');
          }

      });
    }
    // Thêm người dùng mới vào cơ sở dữ liệu
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi xảy ra trong quá trình tạo tài khoản" });
  }
});


// login 

app.post('/login/user', async (req, res)=>{
  try {
    const email = req.body.username;
    const password = req.body.passwork;

    // lấy ra thôn tin từ db 
    const key = await db.query("select * from usersaccount where email = $1", [email,]);
   
    if(key.rows.length > 0){
      const check = (key.rows)[0];

      bcrypt.compare(password, check.password, async (err, hash)=>{
        if(hash){
          status = check.role;
          user.username = check.username;
          user.avatar = check.avatar;
          user.id = check.id;
          res.redirect('/');
        }else{
          res.status(400).json({message: 'sai mat khau'});
        }
      });
      
    }else{
      return res.status(400).json({message: 'email ko tồn tại!'})
    }

  } catch (error) {
    res.status(500).json({message: 'loi ' +  error});
  }
});


// logout

app.get('/logout', (req, res)=>{
  status = 'no';
  delete user.username;
  delete user.avatar;
  delete user.id;
  res.redirect('/');
});



// profile 
app.get('/profile', async (req, res)=>{
  try {

    if(status === "no"){
      res.redirect('/');
    }else{
      res.status(200).render('user.ejs', {key: status, user});
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message); 
  }
});



// notifi
app.get('/notify', async (req, res)=>{
  try {
    res.status(200).render('notify.ejs', {key: status,user});
  } catch (error) {
    
  }
});








// about app


// tìm kiếm 
app.post('/search', async (req, res) => {
  try {
    const searchQuery = `%${req.body.search}%`; // Thêm dấu % vào trước và sau từ khóa tìm kiếm
    const data = await db.query("SELECT * FROM postscontent WHERE title LIKE $1", [searchQuery]); // Sử dụng $1 cho tham số

    if (data.rows.length > 0) {
      res.render("index.ejs", { posts: data.rows, key: status, user });
    } else {
      res.render('err/404.ejs');
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "error search" });
  }
});



// lay tong hop posts

app.get("/", async (req, res) => {
  try {
    var response = db.query("select * from postscontent");
    res.render("index.ejs", { posts: (await response).rows, key: status, user});
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});





app.get("/", async (req, res) => {
  try {

    let id = parseInt(req.query.id);
    let resp = db.query("select * from postscontent where id = $1",[id]);
    console.log(resp);
    res.render("index.ejs", { posts: (await resp).rows });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});






app.get("/new", (req, res) => {
  if(status === 'no'){
    res.redirect('/');
  }else{
    res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
  }
});






app.get("/edit/:id", async (req, res) => {
  try {
    if(status === 'no'){
      res.redirect('/');
    }else{
      const response =  db.query("select * from postscontent where id = $1", [parseInt(req.params.id)]);
      const data = (await response).rows;
      res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: data[0],
    });
    }

  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});





app.post("/api/posts", async (req, res) => {
  try { 
    const data = req.body;
    let id = await db.query("select count(id) from postscontent");
    id = id.rows;
    const response = await db.query('insert into postscontent values($1, $2, $3, $4, $5, $6)', [ parseInt(id[0].count)+1, data.title, data.content, user.username, new Date(), user.id]);
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error creating post" });
  }
});





app.post("/api/posts/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let data = req.body;
    const response = await db.query("update postscontent set title = $1, contentposts = $2, postsdate = $3 where id = $4", [data.title, data.content, new Date(), id]);
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error updating post" });
  }
});





app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await db.query("delete from postscontent where id = $1", [parseInt(req.params.id)]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting post" });
  }
});






app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
