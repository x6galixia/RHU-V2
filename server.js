const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('A new client connected!');

  ws.send('Welcome to the WebSocket server!');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(`You said: ${message}`);
  });

  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});

const pool = require("./models/localdb");
const citizenPool = require("./models/citizendb");
const pharmacyPool = require("./models/pharmacydb");
const path = require("path");
const passport = require("passport");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const flash = require("express-flash");
const initializePassport = require("./passportConfig");

//--> routes
const loginRouter = require("./routes/login");
const scannerRouter = require("./routes/qrcode-scanner");
const nurseRouter = require("./routes/nurse");
const doctorRouter = require("./routes/doctor");
const medtechRouter = require("./routes/medtech");
const pharmacyRouter = require("./routes/pharmacy");
const adminRouter = require("./routes/admin");

pool
  .connect()
  .then(() => console.log("Connected to RHU database"))
  .catch((err) => console.error("Error connecting to RHU database:", err));

citizenPool
  .connect()
  .then(() => console.log("Connected to CITIZEN database"))
  .catch((err) => console.error("Error connecting to CITIZEN database:", err));

pharmacyPool
  .connect()
  .then(() => console.log("Connected to PHARMACY database"))
  .catch((err) => console.error("Error connecting to PHARMACY database:", err));

initializePassport(passport);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use(cors());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

app.use('/uploads', express.static('uploads'));

//---> initialize router
app.use("/", loginRouter);
app.use("/", scannerRouter);
app.use("/", nurseRouter);
app.use("/", doctorRouter);
app.use("/", medtechRouter);
app.use("/", pharmacyRouter);
app.use("/", adminRouter);

app.get("/", (req, res) => {
  res.redirect("/login");
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server is up and running on port ${process.env.PORT}`);
});
