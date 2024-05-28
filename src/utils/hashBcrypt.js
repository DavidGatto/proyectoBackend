import bcrypt from "bcrypt";

// Función para generar el hash de una contraseña
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Función para verificar si una contraseña es válida
const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

// Exportar las funciones para su uso en otros módulos
export { createHash, isValidPassword };
