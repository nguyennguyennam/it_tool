import "dotenv/config";
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import db from "./database/connection";
import path from "path";
import mainRouter from "./routes/main-router";

// The application instance.
const app = express();

db();

// Setup in-memory store and express session.
let memoryStore = MemoryStore(session);
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new memoryStore({
      checkPeriod: 86400000,
    }),
    cookie: {
      secure: true,
    },
  }),
);

// Setup view engine for EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Setup routes
app.use("/", mainRouter);

// Setup public folder for static file serving.
app.use("/static", express.static(path.join(__dirname, "..", "public")));

//User middleware Json to dynamically map attributes from req.body
app.use(express.urlencoded({extended: true}));

// Start the app.
app.listen(parseInt(process.env["PORT"]!), () => {
  console.log(`Process started on ${process.env["PORT"]}`);
});
