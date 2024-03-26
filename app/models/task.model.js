const sql = require("./db.js");

const User = function(user) {
  this.userId = user.userId;
};

User.getTasks = (user, result) => {
  let query = `SELECT t.id record_id, t.task_name, t.start_date, t.end_date, ps.name status_name, t.status_id, tt.name task_type,
            t.task_type_id
         FROM m_task t 
         INNER JOIN m_project_status ps
         ON ps.id = t.status_id
         INNER JOIN m_task_type tt
         ON tt.id = t.task_type_id`;

  if (user.userId) {
    query += ` WHERE t.user_id  = '${user.userId}'`;
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

User.checkIn = (user, result) => {
  let query = `INSERT INTO m_attendance (\`user_id\`, \`check_in\`) VALUES (${user.userId}, current_timestamp())`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

User.checkOut = (user, result) => {
  let query = `UPDATE m_attendance SET check_out = current_timestamp()`

  if (user.userId) {
    query += ` WHERE user_id  = ${user.userId} AND check_out IS NULL`;
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
