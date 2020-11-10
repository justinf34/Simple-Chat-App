const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

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
    console.log("No user name cookie");
    res.cookie("user_name", "testing", { maxAge: 90000, httpOnly: true });
  } else {
    console.log("Has cookie", res.cookie.user_name);
    res.send("Good");
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
