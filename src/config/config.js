import dotenv from "dotenv";
import program from "../utils/commander.js";

const { mode } = program.opts();

dotenv.config({
  path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo",
});

const configObject = {
  mongo_url: process.env.MONGO_URL,
  PUERTO: process.env.PUERTO,
  clientidgithub: process.env.CLIENTIDGITHUB,
  secretclientgithub: process.env.SECRETCLIENTGITHUB,
  callbackurlgithub: process.env.CALLBACKURLGITHUB,
  node_env: process.env.NODE_ENV,
};

export default configObject;
