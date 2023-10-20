const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3005;

app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password123",
  database: "blogsDB",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

function handleImage(imageName, image) {
  const extension = path.extname(imageName);
  const file_name = imageName.slice(0, -4) + Date.now() + extension;
  const filePath = path.join(__dirname, "images", file_name);

  let replaceStr = null;
  let base64Data = null;

  if (extension === ".jpg") {
    replaceStr = /^data:image\/jpeg;base64,/;
  } else {
    replaceStr = /^data:image\/png;base64,/;
  }
  base64Data = image?.replace(replaceStr, "");
  fs.writeFile(filePath, base64Data, { encoding: "base64" }, (err) => {
    if (err) {
      console.error("Error saving the image:", err);
      return undefined;
    }
    console.log("Image saved successfully");
  });
  return file_name;
}

app.get("/userexist/:email", (req, res) => {
  const email = req.params.email;
  console.log(email);
  const sql = `SELECT * FROM userdetail WHERE email = "${email}" ;`;

  db?.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
    console.log("result", result);
  });
});

app.post("/createuser/", (req, res) => {
  const userData = req.body.userDetail;
  const sql = `INSERT INTO userdetail (firstName, lastName, age, email, gender, password) VALUES ("${userData?.firstName}", "${userData?.lastName}", "${userData?.age}", "${userData?.email}", "${userData?.gender}", "${userData?.password}" );`;

  db?.query(sql, (err) => {
    if (err) throw err;
    console.log("User's data inserted successfully");
    res.json({ message: "User's data inserted successfully" });
  });
});

app.get("/blogs", (req, res) => {
  const sql = `SELECT * FROM blogs;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/createblog/:id", (req, res) => {
  const id = req?.params?.id;
  console.log("id is ", id);
  const sql = `SELECT * FROM blogs WHERE id = "${id}";`;
  db?.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/createblog", (req, res) => {
  console.log("Body: ", req.body);
  const blogData = req?.body;

  let imageSrc = handleImage(blogData?.image_name, blogData?.image);
  if (imageSrc !== false) {
    imageSrc = "http://127.0.0.1:3005/images/" + imageSrc;
    console.log("image file", imageSrc);
  } else {
    res.status(500).send("Error saving the image.");
  }

  const sql = `INSERT INTO blogs (title, description, date, modified_date, author, image, userID, image_name) VALUES ("${blogData?.title}", "${blogData?.description}", "${blogData?.date}", "${blogData?.modified_date}", "${blogData?.author}", "${imageSrc}", "${blogData?.userID}", "${blogData?.image_name}" );`;
  db?.query(sql, (err) => {
    if (err) throw err;
    console.log("User's data inserted successfully");
    res.json({ message: "User's data inserted successfully" });
  });
});

app.put("/createblog/:id", (req, res) => {
  const blogData = req?.body;
  console.log("req?.body", req?.body);
  let imageSrc = null;
  let sql = "";
  console.log("req?.body", req?.body);
  if (typeof blogData?.previousImage !== "undefined") {
    fs.unlink(`./images/${blogData?.previousImage?.slice(29)}`, (err) => {
      if (err) throw err;
      console.log("Images removed successfully");

      imageSrc = handleImage(blogData?.image_name, blogData?.image);
      if (imageSrc !== null) {
        imageSrc = "http://127.0.0.1:3005/images/" + imageSrc;
        console.log("this is also the image source", imageSrc);
      } else {
        res.status(500).send("Error saving the image.");
      }
    });
  }
  console.log("image Source", imageSrc);
  if (imageSrc === null) {
    sql = `UPDATE blogs SET title = "${blogData.title}", description = "${blogData.description}", modified_date = "${blogData.modified_date}", author = "${blogData.author}" WHERE id = ${blogData.id} `;
  } else {
    sql = `UPDATE blogs SET title = "${blogData.title}", description = "${blogData.description}", modified_date = "${blogData.modified_date}", author = "${blogData.author}", image = "${imageSrc}", image_name = "${blogData.image_name}" WHERE id = ${blogData.id} `;
  }

  db?.query(sql, (err) => {
    if (err) throw err;
    console.log("User's data inserted successfully");
    res.json({ message: "User's data inserted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
