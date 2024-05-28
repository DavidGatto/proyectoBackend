import { Server as SocketIO } from "socket.io";
import ProductServices from "../repositories/product.repository.js";
import MessageModel from "../models/message.model.js";

const productServices = new ProductServices();

class SocketManager {
  constructor(httpServer) {
    this.io = new SocketIO(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on("connection", async (socket) => {
      console.log("Un usuario se conectó");
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

export default SocketManager;
