const express = require("express");
const router = express.Router();

const LoggerController = require("../controllers/loggerController.js");
const loggerController = new LoggerController();

// Ruta GET /loggertest - se testean los errores
router.get("/", loggerController.testingLogger);

module.exports = router; // Asegúrate de exportar el router
