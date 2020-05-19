// Express application initially forked from parse-server-example project.
// It contains a REST API to cover the functionalities needed for Travel Blog application

const express = require("express");
const ParseServer = require("parse-server").ParseServer;
const dotenv = require("dotenv");
dotenv.config();
const ParseDashboard = require("parse-dashboard");
const cors = require("cors");

const databaseUri = process.env.DB_URI;
// Import the custom API routes
const landmarkRouter = require("./server/routes/updateLandmarkAPI");
const imgRouter = require("./server/routes/uploadImageAPI");

const app = express();

if (!databaseUri) {
  console.log("DB_URI not specified, falling back to localhost.");
}

const api = new ParseServer({
  databaseURI: process.env.DB_URI,
  appId: process.env.APP_ID || "myAppId",
  masterKey: process.env.MASTER_KEY || "masterKey",
  serverURL: process.env.SERVER_URL + "/parse" || "http://localhost:1337/parse", // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"], // List of classes to support for query subscriptions
  },
});

const dashboard = new ParseDashboard({
  apps: [
    {
      serverURL: `${process.env.SERVER_URL}/parse`,
      appId: process.env.APP_ID,
      masterKey: process.env.MASTER_KEY,
      appName: process.env.APP_NAME,
    },
  ],
  users: [
    {
      user: process.env.ADMIN_USER,
      pass: process.env.ADMIN_PASSWORD,
    },
  ],
});

const port = process.env.SERVER_PORT || 1337;
const httpServer = require("http").createServer(app);
httpServer.listen(port, function() {
  console.log("parse-server-example running on port " + port + ".");
});

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || "/parse";

// Cors was used to accept * for the file uploading service
app.use(cors({ origin: "*" }));
app.use(mountPath, imgRouter);
app.use(mountPath, landmarkRouter);
app.use(mountPath, api);

app.use("/", dashboard);
app.use("/dashboard", dashboard);

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
