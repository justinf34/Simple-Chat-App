const crypto = require("crypto");

module.exports = function () {
  const user_names = new Set();
  const Users = new Map();

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

    console.log("addNewUser: ", Users);
  }

  function removeUser(socketID) {
    const user = Users.get(socketID);
    if (user) {
      user_names.delete(user.name);
      Users.delete(socketID);
      // Let others know that user left
    }

    console.log("removeUser: ", Users);
  }

  return {
    newUserName,
    userNameTaken,
    addNewUser,
    removeUser,
  };
};
