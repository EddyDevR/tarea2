import http from 'http';
import path from "path";
// Biblioteca path
import app from './app.js';
// Recreando Built-in variables
global["__dirname"] = path.dirname(new URL(import.meta.url).pathname);
/*
global["__filename"] = path.join(new URL(import.meta.url).pathname);
*/
// 2. crear el servidor


const server = http.createServer(app);

// 3. arrancar el servidor
server.listen(3000, "0.0.0.0", () => {
  console.log("👩‍🍳 Servidor escuchando en http://localhost:3000");
});