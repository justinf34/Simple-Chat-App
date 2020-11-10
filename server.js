const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const Manager = require("./src/Manager")();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "client/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.post("/username", (req, res) => {
  console.log("Got a request", req.cookies);
  if (!req.cookies.user_name) {
    console.log("/username: New user!");
    // Generate new random user name
    res
      .cookie("user_name", Manager.newUserName(), {
        maxAge: 60 * 60 * 1000,
      })
      .send(JSON.stringify({ code: true }));
  } else {
    if (Manager.userNameTaken(req.cookies.user_name)) {
      res
        .cookie("user_name", Manager.newUserName(), {
          maxAge: 60 * 60 * 1000,
        })
        .send(JSON.stringify({ newName: true }));
    } else {
      //TODO: reset the cookie maxAge
      res.send(JSON.stringify({ newName: false }));
    }
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

let port = process.env.PORT || 8888;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listening on port ${port}...`);
});
