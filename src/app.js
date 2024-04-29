const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const exphbs = require("express-handlebars");
const winston = require("winston");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

const PUERTO = 8080;
require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/session.router.js");
const loggerRouter = require("./routes/logger.router.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(
  session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://daviddgatto:12345@coderdb.bnklr4n.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 100,
    }),
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
const addLogger = (req, res, next) => {
  // Configurar el logger
  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "errors.log" }),
    ],
  });
  req.logger = logger;
  next();
};

app.use(addLogger);

//Routes
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/loggertest", loggerRouter);

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

exphbs.create({
  allowProtoMethodsByDefault: true,
  allowProtoPropertiesByDefault: true,
});

const handlebars = require("handlebars");

handlebars.registerHelper("getProperty", function (object, property) {
  return object[property];
});

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

const SocketManager = require("./socket/socket.manager.js");
const logger = require("./utils/logger.js");

new SocketManager(httpServer);
