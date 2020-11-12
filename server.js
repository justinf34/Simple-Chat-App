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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "client/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const COOKIE_MAXAGE = 60 * 60 * 1000;

app.post("/id", (req, res) => {
  console.log("id: Got a request", req.cookies);

  if (!req.cookies.user_id) {
    console.log("/id: New user!");

    const usr = Manager.newUser();

    res
      .cookie("user_id", usr.id, {
        maxAge: COOKIE_MAXAGE,
      })
      .send(JSON.stringify({ new: true }));
  } else {
    //TODO: reset the cookie maxAge
    res.send(JSON.stringify({ new: false }));
  }
});

io.on("connection", (socket) => {
  console.log("socket: a user connected");

  socket.on("joinID", (id) => {
    console.log(`socket id: ${id} ${socket.id} joined...`);

    const name = Manager.setUserOnline(socket.id, id); // Set user online
    socket.emit("name", name); //Give client its new name

    // Tell everyone that someone new joined
    const users_list = Manager.getUsers();
    io.emit("usersList", users_list);
    io.emit("newMessageList", Manager.getMessages());
  });

  socket.on("disconnect", () => {
    console.log(`socket: ${socket.id} disconnected... `);
    const user = Manager.removeUser(socket.id);
    //Let other users know that someone disconnected
    if (user) {
      socket.broadcast.emit("leaveUser", Manager.getUsers());
      socket.broadcast.emit("newMessageList", Manager.getMessages());
    }
  });

  socket.on("message", (msg) => {
    Manager.addMessage(socket.id, msg);
    io.emit("newMessageList", Manager.getMessages()); // Tell the everyone to get the newest messages
  });

  socket.on("color-change", (color) => {
    console.log(`socket: ${socket.id} requested a colour change to ${color}`);
    Manager.changeColour(socket.id, color);

    io.emit("usersList", Manager.getUsers());
    io.emit("newMessageList", Manager.getMessages());
  });
});

let port = process.env.PORT || 8888;
http.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listening on port ${port}...`);
});
