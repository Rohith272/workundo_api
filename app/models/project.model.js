const sql = require("./db.js");

const User = function(user) {
  this.userId = user.userId;
};

User.getProjects = (user, result) => {
  let query = "SELECT * FROM m_project_access";

  if (user.userId) {
    query += ` WHERE user_id  = '${user.userId}'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = { User };
