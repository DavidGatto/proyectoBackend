import mongoose from "mongoose";
import configObject from "./config/config.js";
import logger from "./utils/logger.js";
const { mongo_url } = configObject;

class BaseDatos {
  static #instance;

  constructor() {
    mongoose.connect(mongo_url);
  }

  static getInstance() {
    if (this.#instance) {
      logger.info("Database connection already exists.");
      return this.#instance;
    }

    this.#instance = new BaseDatos();
    logger.info("Connection to database successful.");
    return this.#instance;
  }
}

export default BaseDatos.getInstance();
