import io from "socket.io-client";

const SOCKET_IO_URL = "http://localhost:8888";

export default function () {
  const socket = io("http://localhost:8888");

  socket.on("connect", (data) => {
    console.log("Connected to the server socket...");
  });

  socket.on("error", (err) => {
    console.warn("received socket error: ", err);
  });

  function joinRoom(user_name) {
    socket.emit("join", user_name);
  }

  function registerDisconnect(onDisconnect) {
    socket.on("disconnect", onDisconnect);
  }

  function registerUsersList(onUsersList) {
    socket.on("usersList", onUsersList);
  }

  function registerNewUser(onNewUser) {
    socket.on("newUser", onNewUser);
  }

  function registerLeaveUser(onLeaveUser) {
    socket.on("leaveUser", onLeaveUser);
  }

  return {
    joinRoom,
    registerDisconnect,
    registerUsersList,
    registerNewUser,
    registerLeaveUser,
  };
}
