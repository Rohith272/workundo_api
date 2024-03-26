module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");
  const loginController = require("../controllers/login.controller.js");
  const projectController = require("../controllers/projects.controller.js");
  const taskController = require("../controllers/tasks.controller.js");

  var router = require("express").Router();

  router.post("/login", loginController.login);

  router.post("/validateSession", loginController.validateSession);

  router.get("/getProjects", projectController.getProjects);

  router.get("/getBasicDetails", projectController.getBasicDetails);

  router.get("/getTasks", taskController.getTasks);

  router.post("/checkIn", taskController.checkIn);

  router.post("/checkOut", taskController.checkOut);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Delete all Tutorials
  router.delete("/", tutorials.deleteAll);

  app.use('/api', router);
};
