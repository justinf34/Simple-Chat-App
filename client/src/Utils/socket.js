import io from "socket.io-client";

const SOCKET_IO_URL = "http://localhost:8888";

export default function () {
  const socket = io("http://localhost:8888");

  socket.on("connect", (data) => {
    console.log("Connected to the server socket...");
    // Get value of user name cookie
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_name"))
      .split("=")[1];
    console.log(cookieValue);

    // Send the socket server you user name
    socket.emit("join", cookieValue);
  });

  socket.on("error", (err) => {
    console.warn("received socket error: ", err);
  });

  function registerDisconnect(onDisconnect) {
    socket.on("disconnect", onDisconnect);
  }

  return {
    registerDisconnect,
  };
}
