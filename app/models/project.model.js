const sql = require("./db.js");

const User = function(user) {
  this.userId = user.userId;
};

User.getProjects = (user, result) => {
  let query = "SELECT p.id project_id, p.project_id project_number, p.project_name, p.start_date, p.end_date, p.status_id, ps.name status_name FROM m_project_access pa INNER JOIN  m_project p ON p.id = pa.project_id INNER JOIN m_project_status ps ON ps.id = p.status_id";

  if (user.userId) {
    query += ` WHERE pa.user_id  = '${user.userId}'`;
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

User.getPendingCount = (user, result) => {
  let query = "SELECT COUNT(*) AS pending_project_count FROM m_project_access pa INNER JOIN m_project p ON p.id = pa.project_id";

  if (user.userId) {
    query += ` WHERE p.status_id = 1 AND pa.user_id  = '${user.userId}'`;
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
