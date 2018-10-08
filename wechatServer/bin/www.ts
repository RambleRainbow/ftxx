
/**
 * Module dependencies.
 */

import app from "../app";
import * as debugModule from "debug";
import * as http from "http";
import { AddressInfo } from "net";

let debug: any = debugModule("ts-express:www");


/**
 * Get port from environment and store in Express.
 */

let port:number|string = normalizePort(process.env.PORT || "8080");
app.set("port", port);

/**
 * Create HTTP server.
 */

let server:http.Server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val:number|string): string|number {
  if(typeof val === "string") {
    var port:number = parseInt(val, 10);
  }

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return 0;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind:string = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  var addr:string|AddressInfo = server.address();
  var bind: string = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  debug("Listening on " + bind);
}
