const crypto = require("crypto");
const { get } = require("http");
const flatten = require("array-flatten");

module.exports = function () {
  const online_users = new Map();

  const messageArr = [];

  const known_users = new Map();

  function newUserName2(name) {
    let user_name = name;
    let changed = false;
    const online_usr_infos = Array.from(online_users.values());

    while (
      online_usr_infos.filter((usr) => usr.name === user_name).length > 0
    ) {
      changed = true;
      user_name = crypto.randomBytes(8).toString("hex");
    }

    return {
      name: user_name,
      new: changed,
    };
  }

  function newUser() {
    // generate id
    const taken_ids = Array.from(known_users.keys());
    let new_id = "";
    do {
      new_id = crypto.randomBytes(8).toString("hex");
    } while (taken_ids.includes(new_id));

    //generate usernam
    const taken_infos = Array.from(known_users.values());
    let new_name = "";
    do {
      new_name = crypto.randomBytes(8).toString("hex");
    } while (taken_infos.filter((usr) => usr.name === new_name).length > 0);

    const user_info = {
      name: new_name,
      color: "007bff",
    };

    // Add user to know users
    known_users.set(new_id, user_info);
    console.log("Known users", known_users);

    return {
      id: new_id,
      name: new_name,
    };
  }

  function setUserOnline(socket_id, id) {
    // get user name
    const name = known_users.get(id).name;
    const res = newUserName2(name);

    if (res.new) {
      // update messages of that user
      messageArr.forEach((elem) => {
        if (elem.id === id) {
          elem.author = res.name;
        }
      });

      known_users.set(id, res.name);
    }

    // Add the user to the online list
    online_users.set(socket_id, {
      id: id,
      name: res.name,
      color: known_users.get(id).color,
    });

    const date = new Date();
    const message = {
      id: id,
      author: res.name,
      type: 0,
      color: known_users.get(id).color,
      message: "joined the room",
      date:
        ("0" + date.getHours()).substr(-2) +
        ":" +
        ("0" + date.getMinutes()).substr(-2),
    };

    messageArr.push(message);

    console.log("addNewUser: ", online_users);
    return res.name;
  }

  function removeUser(socketID) {
    const user = online_users.get(socketID);

    if (user) {
      const date = new Date();

      const message = {
        id: user.id,
        author: user.name,
        type: 0,
        color: user.color,
        message: "left the room",
        date:
          ("0" + date.getHours()).substr(-2) +
          ":" +
          ("0" + date.getMinutes()).substr(-2),
      };

      messageArr.push(message);

      online_users.delete(socketID);

      console.log("removeUser: ", online_users);

      return user;
    } else {
      return undefined;
    }
  }

  function getUsers() {
    const users = online_users.values();
    return Array.from(users);
  }

  function addMessage(socketID, message) {
    const date = new Date();
    message.date =
      ("0" + date.getHours()).substr(-2) +
      ":" +
      ("0" + date.getMinutes()).substr(-2);
    message.color = online_users.get(socketID).color;
    message.author = known_users.get(message.id).name;
    try {
      messageArr.push(message);
    } catch (erro) {
      console.log("addMessage: That user does not exist");
    }
  }

  function getMessages() {
    return messageArr;
  }

  return {
    newUser,
    removeUser,
    getUsers,
    addMessage,
    getMessages,
    setUserOnline,
  };
};
