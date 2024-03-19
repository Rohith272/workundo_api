const cacheService = require("../service/cache.service.js");
const { User } = require("../models/task.model.js");
const { SessionDetails } = require("../models/login.model.js");

exports.getTasks = (req, res) => {
    const token = req.headers.authorization;
    if (token) {
        getUserDetails(token, res, (userId) => {
            User.getTasks({ userId: userId }, (err, taskData) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ message: "Error retrieving project access data", isSuccess: false });
                    return;
                }
                
                res.send({records :taskData, isSuccess : true});
            });
        });
    } else {
        res.status(401).send({ message: "Missing Authorization Token", isActive: false, errorCode: 401 });
        return;
    }
};

function getUserDetails(token, res, callback) {
    const cachedData = cacheService.getCachedModel(token);
    if (cachedData) {
        const userData = {
            message: "Success",
            isActive: true
        };
        return(cachedData.id);
    } else {
        SessionDetails.getSession({ sessionId: token }, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ message: "Internal server error", isActive: false });
                return;
            }

            if (data.length === 0) {
                res.status(404).send({ message: "Session expired", isActive: false });
            } else {
                callback(data[0].user_id);
            }
        });
    }
};

