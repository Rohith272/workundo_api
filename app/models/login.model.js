const sql = require("./db.js");
const moment = require('moment');

const User = function(user) {
  this.username = user.username;
  this.password = user.password;
};

const UserDetails = function(userDetails){
  this.userId = userDetails.id;
  this.sessionTimeOut = userDetails.sessionTimeOut;
};

const SessionDetails = function(sessionDetails){
  this.sessionId= sessionDetails.sessionId;
}

User.getUserByUsername = (username, result) => {
  let query = "SELECT * FROM m_user";

  if (username.username) {
    query += ` WHERE username = '${username.username}'`;
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

UserDetails.createLoginSession = (userDetails, result) =>{
  let currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

  let query = `INSERT INTO workundo_dev.m_login_session 
               (user_id, login_datetime, logout_datetime, session_timeout) 
               VALUES 
               (${userDetails.userId}, '${currentTime}', NULL, ${userDetails.sessionTimeOut ?? null})`;
  
               sql.query(query, (err, res) => {
                if (err) {
                  console.log("error: ", err);
                  result(err, null);
                  return;
                }
            
                const rowId = res.insertId;
                let getSessionIdQuery = `SELECT session_id FROM workundo_dev.m_login_session WHERE id = ${rowId}`;
                sql.query(getSessionIdQuery, (getSessionIdErr, getSessionIdRes) => {
                  if (getSessionIdErr) {
                    console.log("error fetching session_id: ", getSessionIdErr);
                    result(getSessionIdErr, null);
                    return;
                  }
            
                  let sessionId = getSessionIdRes[0].session_id;
                  console.log("Session created successfully with session_id:", sessionId);
                  result(null, sessionId);
                });
              });         
}

SessionDetails.getSession = (sessionDetails, result) => {
  let query = "SELECT * FROM m_login_session";

  if (sessionDetails.sessionId) {
    query += ` WHERE session_id = '${sessionDetails.sessionId}'`;
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

module.exports = { User, UserDetails, SessionDetails };
