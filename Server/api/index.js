require("dotenv").config();
let express = require("express");
let apiRouter = express.Router();
const app = express();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//check to see if the user is logged in already by verifying his token
apiRouter.use(async (req, res, next) => {
  let prefix = "Bearer ";
  let auth = req.header("Authorization");

  if (!auth) {
    //user is not logged in
    console.log("user not logged in!");
    next();
  } else if (auth.startsWith(prefix)) {
    let token = auth.slice(prefix.length);

    try {
      let { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        next();
      } else {
        next({
          name: "Authorization Head Error",
          message: "Token is not acceptable",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "authorization Head Error",
      message: `Authorization must starts with ${prefix}`,
    });
  }
});

apiRouter.get("/", (req, res) => {
  res.json({ message: "inside api/index.js" });
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("user is set as:", req.user.name);
  }
  next();
});

let usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

let eventsRouter = require("./events");
apiRouter.use("/events", eventsRouter);

apiRouter.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  console.error(error); // Log the error for debugging purposes
  res.status(status).json({
    error: message,
  });
});

module.exports = apiRouter;
