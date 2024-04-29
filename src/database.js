const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const { mongo_url } = configObject;
const logger = require("./utils/logger.js");

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

module.exports = BaseDatos.getInstance();
