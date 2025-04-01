import "dotenv/config";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import session from "express-session";
import MemoryStore from "memorystore";
import path from "path";

// The application instance.
const app = express();

// Setup in-memory store and express session.
let memoryStore = MemoryStore(session);
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: process.env["SESSION_SECRET"]!,
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

// Test! You should see a Hello World on home page.
app.get(
  "/",
  expressAsyncHandler((req, res) => {
    console.log("/ route accessed");
    res.render("layouts/main", {
      layout: {
        title: "Home page",
        content: "home",
      },
    });
  }),
);

// Setup public folder for static file serving.
app.use("/static", express.static(path.join(__dirname, "..", "public")));

// Start the app.
app.listen(parseInt(process.env["PORT"]!), () => {
  console.log(`Process started on ${process.env["PORT"]}`);
});
