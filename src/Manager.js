const crypto = require("crypto");

module.exports = function () {
  const users = [];

  function newUserName() {
    let user_name = "";
    do {
      user_name = crypto.randomBytes(8).toString("hex");
    } while (users.filter((user) => user.name === user_name).length > 0);

    return user_name;
  }

  function userNameTaken(user_name) {
    if (users.filter((user) => user.nam === user_name).length > 0) {
      return true;
    }
    return false;
  }

  return {
    newUserName: newUserName,
    userNameTaken: userNameTaken,
  };
};
