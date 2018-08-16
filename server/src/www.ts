#!/usr/bin/env node

/**
 * Module dependencies.
 */
import * as express from "express";
import { Server } from "./server";
import * as debugModule from "debug";
import * as http from "http";



var debug:debugModule.IDebugger = debugModule("wechatcallbackserver:server");

/**
 * Get port from environment and store in Express.
 */

var port: any = normalizePort(process.env.PORT || "3000");
var app:express.Application = Server.bootstrap().app;
app.set("port", port);

/**
 * Create HTTP server.
 */
var httpServer:http.Server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

httpServer.listen(port);
httpServer.on("error", onError);
httpServer.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): any {
  var port: number = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind: any = typeof port === "string"
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

function onListening(): any {
  var addr: any = httpServer.address();
  var bind: any = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  debug("Listening on " + bind);
}
