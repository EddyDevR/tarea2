import http from 'http';
// Biblioteca path
import path from "path";
import { promises as fs } from 'fs';

// Recreando Built-in variables
global["__dirname"] = path.dirname(new URL(import.meta.url).pathname);
/*
global["__filename"] = path.join(new URL(import.meta.url).pathname);
*/
// 2. crear el servidor

const server = http.createServer((req, res) => {
  // Desestructurando de "req"
  let { url, method } = req;

  console.log(`📣 CLIENT-REQUEST:${req.url} ${req.method}`);

  // Enrutando peticiones
  switch (url) {
    case '/':
      // Petición raiz 
      // Estableciendo cabeceras
      res.setHeader('Content-Type', 'text/html')
      // Escribiendo la respuesta
      res.write(`
            <html>
        <head>
          <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
          <title>My App</title>
          <style>
            body {
              background-color: #ECF0F1;
              font-family: Arial, sans-serif;
            }
            h1, h2 {
              color: #3498DB;
              text-align: center;
              margin-top: 50px;
            }
            form {
              margin-top: 30px;
              text-align: center;
            }
            input[type="text"] {
              width: 300px;
              padding: 10px;
              border: none;
              border-radius: 5px;
              box-shadow: 0px 0px 5px #3498DB;
              outline: none;
            }
            button[type="submit"] {
              background-color: #3498DB;
              color: #fff;
              border: none;
              border-radius: 5px;
              padding: 10px 20px;
              cursor: pointer;
              box-shadow: 0px 0px 5px #3498DB;
              outline: none;
            }
            button[type="submit"]:hover {
              background-color: #2980B9;
            }
          </style>
        </head>
        <body> 
          <h1>Hello from my server</h1>
          <h2>Ingresa un mensaje</h2>
          <div>
            <form action="/message" method="POST">
              <input type="text" name="message">
              <button type="submit">Send</button>
            </form>
          </div>
        </body>
      </html>
            `);
      console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
      // Estableciendo codigo de respuesta
      res.statusCode = 200;
      // Cerrando la comunicacion
      res.end();
      break;
    case '/author':
      res.setHeader('Content-Type', 'text/html')

      // Escribiendo la respuesta
      res.write(`
            <html>
                <head>
                    <title>My App</title>
                    <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
                </head>
                <body> 
                    <h1 style="color:#EA1955;"> Autor </h1>
                    <p>Obrajero Arguelles Mariana Abigail</p>
                    <img src="https://scontent.fmex23-1.fna.fbcdn.net/v/t1.6435-9/122602514_1697256130433020_570043739953015801_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeE0fJrSSmymMpuWNaeWUcb70JNezeuScsLQk17N65Jywipr5XrsWJijXpUV0Pqpa9EJifkh_7qlH0GMmhDN30dR&_nc_ohc=4eLtvrE16SIAX9oREg7&_nc_ht=scontent.fmex23-1.fna&oh=00_AfC0DcwJdPxNLYYaUiXaw-5rMB3qkeVPVf_xqGLVhLKCaA&oe=6477CDFD" alt="Girl in a jacket" width="300" height="400">
                </body>
            </html>
            `);
      console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
      // Estableciendo código de respuesta 
      res.statusCode = 200;
      // Cerrando la comunicación 
      res.end();
      break;

    case '/favicon.ico':
      // Especificar la ubicación del archivo de icono
      const filePath = path.join(path.dirname(new URL(import.meta.url).pathname), 'favicon.ico');

      console.log(filePath);
      fs.readFile(filePath, (err, data) => {
        if (err) {

          res.writeHead(404, { 'Content-Type': 'text/html' });

          res.end('404 Not Found');

        } else {

          res.setHeader('Content-Type', 'image/x-icon');

          res.end(data);

        }
      });
      break;

    case "/message":
      // Verificando si es post
      if (method === "POST") {
        // Se crea una variable para almacenar los
        // Datos entrantes del cliente
        let body = "";
        // Se registra un manejador de eventos
        // Para la recepción de datos
        req.on("data", (data => {
          body += data;
          if (body.length > 1e6) return req.socket.destroy();
        }));
        // Se registra una manejador de eventos
        // para el termino de recepción de datos
        req.on("end", () => {
          // Procesa el formulario
          // Mediante URLSearchParams se extraen
          // los campos del formulario
          const params = new URLSearchParams(body);
          // Se construye un objeto a partir de los datos
          // en la variable params
          const parsedParams = Object.fromEntries(params);
          fs.writeFile('message.txt', parsedParams.message);
        })

        res.statusCode = 302;
        res.setHeader('Location', '/');
        // Se finaliza la conexion
        return res.end();
      } else {
        res.statusCode = 404;
        res.write("404: Endpoint no encontrado")
        res.end();
      }
      break;
    // Continua con el defautl
    default:
      // Peticion raiz
      // Estableciendo cabeceras
      res.setHeader('Content-Type', 'text/html');
      // Escribiendo la respuesta
      res.write(`
                <html>
                  <head>
                    <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">
                    <title>My App</title>
                  </head>
                  <body> 
                    <h1>&#128534; 404 Recurso no encontrado</h1>
                    <p>Lo sentimos pero no tenemos lo que buscas...</p>
                  </body>
                </html>
                `);
      console.log(`📣 Respondiendo: 404 ${req.url} ${req.method}`);
      // Estableciendo codigo de respuesta
      res.statusCode = 404;
      // Cerrando la comunicacion
      res.end();
      break;
  }
});

// 3. arrancar el servidor
server.listen(3000, "0.0.0.0", () => {
  console.log("👩‍🍳 Servidor escuchando en http://localhost:3000");
});