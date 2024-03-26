const { User, UserDetails, SessionDetails } = require("../models/login.model.js");
const bcrypt = require("bcrypt");
const cacheService = require("../service/cache.service.js");

exports.login = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "No data in the body"
    });
    return;
  }

  const salt = "$2b$10$Ds7o2ew0ywiKKzUy8px8vO";
  const encryptedPassword = encryptPassword(req.body.password, salt);
  
  const user = {
    username: req.body.username,
    password: encryptedPassword
  };

  User.getUserByUsername(user, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Tutorial."
      });
      return;
    }

    if (data.length === 0 || data[0].password !== user.password) {
      res.send({ message: "Invalid Credentials", isSuccess: false });
      return;
    }

    UserDetails.createLoginSession({ userId: data[0].id, sessionTimeOut: 600000 }, (createSessionErr, sessionId) => {
      if (createSessionErr) {
        res.status(500).send({
          message: createSessionErr.message || "Error creating login session."
        });
        return;
      }
      cacheService.setCache(sessionId, data[0]);
      res.send({ message: "Login successful", sessionId: sessionId, isSuccess: true });
    });
  });
};

exports.validateSession = (req, res) => {
  if (req.body && req.body.sessionId) { 
      const cachedData = cacheService.getCachedModel(req.body.sessionId);
      if (cachedData) {
          const userData = {
              message: "Success",
              isActive: true
          };
          res.send(userData);
      } else {
          SessionDetails.getSession({ sessionId: req.body.sessionId }, (err, data) => {
              if (err) {
                  console.error(err);
                  res.status(500).send({ message: "Internal server error", isActive: false });
                  return;
              }
              
              if (data.length === 0) {
                  res.status(404).send({ message: "Session expired", isActive: false });
              } else {
                  const userData = {
                      message: "Success",
                      isActive: true
                  };
                  res.send(userData);
              }
          });
      }
  } else {
      res.status(400).send({ message: "Invalid request, sessionId is required", isActive: false });
  }
};

const encryptPassword = (password, salt) => {
    return bcrypt.hashSync(password, salt);
};

