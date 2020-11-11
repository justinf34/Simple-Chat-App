const crypto = require("crypto");
const { get } = require("http");
const flatten = require("array-flatten");

module.exports = function () {
  const user_names = new Set();
  const online_users = new Map();

  const Messages = new Map();
  const messageArr = [];
  const messageArr2 = [];

  const known_users = new Map();

  function newUserName() {
    let user_name = "";
    do {
      console.log("Creating a new username");
      user_name = crypto.randomBytes(8).toString("hex");
    } while (user_names.has(user_name));

    return user_name;
  }

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

  function userNameTaken(user_name) {
    if (user_names.has(user_name)) {
      return true;
    }
    return false;
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

    return {
      id: new_id,
      name: new_name,
    };
  }

  function addNewUser(socketID, user_name) {
    const new_user = {
      name: user_name,
      color: "007bff",
    };
    online_users.set(socketID, new_user);
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
    messageArr.push(message);

    console.log("addNewUser: ", online_users);
    return new_user;
  }

  function setUserOnline(socket_id, id) {
    // get user name
    const name = known_users.get(id).name;
    const res = newUserName2(name);

    if (res.new) {
      // update messages of that user
      messageArr2.forEach((elem) => {
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
    // Let others know
  }

  function removeUser(socketID) {
    const user = online_users.get(socketID);
    if (user) {
      user_names.delete(user.name);
      online_users.delete(socketID);

      //TODO: set a default colour for this user's messages

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
    const msgs = Messages.get(socketID);
    try {
      msgs.push(message);
      messageArr.push(message);
    } catch (erro) {
      console.log("addMessage: That user does not exist");
    }
  }

  function getMessages() {
    const msgs = Array.from(Messages.values());

    return messageArr;
    // return [].concat(...msgs);
  }

  return {
    newUser,
    newUserName,
    userNameTaken,
    addNewUser,
    removeUser,
    getUsers,
    addMessage,
    getMessages,
    setUserOnline,
  };
};
