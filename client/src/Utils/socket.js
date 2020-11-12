import io from "socket.io-client";

const SOCKET_IO_URL =
  process.env.NODE_ENV !== "production" ? "http://localhost:8888" : "";

export default function () {
  const socket = io(SOCKET_IO_URL);

  socket.on("connect", (data) => {
    console.log("Connected to the server socket...");
  });

  socket.on("error", (err) => {
    console.warn("received socket error: ", err);
  });

  function joinRoomID(id) {
    socket.emit("joinID", id);
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

  function sendMessage(msg) {
    socket.emit("message", msg);
  }

  function registerNewMsgList(onNewMsgList) {
    socket.on("newMessageList", onNewMsgList);
  }

  function changeColor(color) {
    socket.emit("color-change", color);
  }

  function changeName(name) {
    socket.emit("name-change", name);
  }

  function registerDeniedNameChange(onDenied) {
    socket.on("name-change-denied", onDenied);
  }

  return {
    joinRoomID,
    registerDisconnect,
    registerUsersList,
    registerNewUser,
    registerLeaveUser,
    registerNewMsgList,
    sendMessage,
    changeColor,
    changeName,
    registerDeniedNameChange,
  };
}
