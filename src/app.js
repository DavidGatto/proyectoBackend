import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import exphbs from "express-handlebars";
import winston from "winston";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import "./database.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import userRouter from "./routes/user.router.js";
import sessionRouter from "./routes/session.router.js";
import loggerRouter from "./routes/logger.router.js";
import SocketManager from "./socket/socket.manager.js";
import logger from "./utils/logger.js";

const PUERTO = 8080;

const app = express();

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
      ttl: 300,
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

import handlebars from "handlebars";

handlebars.registerHelper("getProperty", function (object, property) {
  return object[property];
});

const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

new SocketManager(httpServer);
export default app;
