const socket = require("socket.io");
const ProductServices = require("../repositories/product.repository.js");
const productServices = new ProductServices();
const MessageModel = require("../models/message.model.js");

class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on("connection", async (socket) => {
      console.log("Un usuario se conecto");
      socket.emit("products", await productServices.getProducts());
      socket.on("deleteProductById", async (id) => {
        await productServices.deleteProductById(id);
        this.emitUpdatedProducts(socket);
      });
      socket.on("addProduct", async (product) => {
        await productServices.addProduct(product);
        this.emitUpdatedProducts(socket);
      });
      socket.on("message", async (history) => {
        await MessageModel.create(history);
        const messages = await MessageModel.find();
        socket.emit("message", messages);
      });
    });
  }

  async emitUpdatedProducts(socket) {
    socket.emit("products", await productServices.getProducts());
  }
}

module.exports = SocketManager;
