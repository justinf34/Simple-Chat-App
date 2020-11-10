const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http, { cors: true, origins: ["*:*"] });

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

const COOKIE_MAXAGE = 60 * 60 * 1000;
app.post("/username", (req, res) => {
  console.log("Got a request", req.cookies);
  if (!req.cookies.user_name) {
    console.log("/username: New user!");
    // Generate new random user name
    res
      .cookie("user_name", Manager.newUserName(), {
        maxAge: COOKIE_MAXAGE,
      })
      .send(JSON.stringify({ code: true }));
  } else {
    if (Manager.userNameTaken(req.cookies.user_name)) {
      res
        .cookie("user_name", Manager.newUserName(), {
          maxAge: COOKIE_MAXAGE,
        })
        .send(JSON.stringify({ newName: true }));
    } else {
      //TODO: reset the cookie maxAge
      res.send(JSON.stringify({ newName: false }));
    }
  }
});

io.on("connection", (socket) => {
  console.log("socket: a user connected");

  socket.on("join", (user_name) => {
    console.log(`socket: ${user_name} ${socket.id} joined...`);
    const new_user = Manager.addNewUser(socket.id, user_name);

    const users = Manager.getUsers();
    //Send client the user list and message history
    socket.emit("usersList", users);

    //Let others know that someone joined the server
    socket.broadcast.emit("newUser", users);
  });

  socket.on("disconnect", function () {
    console.log(`socket: ${socket.id} disconnected... `);
    const user = Manager.removeUser(socket.id);
    //Let other users know that someone disconnected
    if (user) {
      socket.broadcast.emit("leaveUser", Manager.getUsers());
    }
  });
});

let port = process.env.PORT || 8888;
http.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listening on port ${port}...`);
});
