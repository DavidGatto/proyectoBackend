const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const { mongo_url } = configObject;

class BaseDatos {
  static #instance;

  constructor() {
    mongoose.connect(mongo_url);
  }

  static getInstance() {
    if (this.#instance) {
      console.log("Conexion previa");
      return this.#instance;
    }

    this.#instance = new BaseDatos();
    console.log("Conexión exitosa");
    return this.#instance;
  }
}

module.exports = BaseDatos.getInstance();
