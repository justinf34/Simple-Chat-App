const crypto = require("crypto");
const { get } = require("http");
const flatten = require("array-flatten");

module.exports = function () {
  const user_names = new Set();
  const Users = new Map();
  const Messages = new Map();
  const Messagev2 = [];

  function newUserName() {
    let user_name = "";
    do {
      console.log("Creating a new username");
      user_name = crypto.randomBytes(8).toString("hex");
    } while (user_names.has(user_name));

    return user_name;
  }

  function userNameTaken(user_name) {
    if (user_names.has(user_name)) {
      return true;
    }
    return false;
  }

  function addNewUser(socketID, user_name) {
    const new_user = {
      name: user_name,
      color: "007bff",
    };
    Users.set(socketID, new_user);
    user_names.add(user_name);

    const date = new Date();
    const message = {
      author: user_name,
      type: 0,
      color: "007bff",
      message: "joined the room",
      date:
        ("0" + date.getHours()).substr(-2) +
        ":" +
        ("0" + date.getMinutes()).substr(-2),
    };

    Messages.set(socketID, [message]);
    Messagev2.push(message);

    console.log("addNewUser: ", Users);
    return new_user;
  }

  function removeUser(socketID) {
    const user = Users.get(socketID);
    if (user) {
      user_names.delete(user.name);
      Users.delete(socketID);

      //TODO: set a default colour for this user's messages

      console.log("removeUser: ", Users);

      return user;
    } else {
      return undefined;
    }
  }

  function getUsers() {
    const users = Users.values();
    return Array.from(users);
  }
  function addMessage(socketID, message) {
    const date = new Date();
    message.date =
      ("0" + date.getHours()).substr(-2) +
      ":" +
      ("0" + date.getMinutes()).substr(-2);
    message.color = Users.get(socketID).color;
    const msgs = Messages.get(socketID);
    try {
      msgs.push(message);
      Messagev2.push(message);
    } catch (erro) {
      console.log("addMessage: That user does not exist");
    }
  }

  function getMessages() {
    const msgs = Array.from(Messages.values());

    return Messagev2;
    // return [].concat(...msgs);
  }

  return {
    newUserName,
    userNameTaken,
    addNewUser,
    removeUser,
    getUsers,
    addMessage,
    getMessages,
  };
};
