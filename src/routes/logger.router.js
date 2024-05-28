import express from "express";
const router = express.Router();

import LoggerController from "../controllers/loggerController.js";
const loggerController = new LoggerController();

// Ruta GET /loggertest - se testean los errores
router.get("/", loggerController.testingLogger);

export default router; // Asegúrate de exportar el router
