// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require("express");
const ParseServer = require("parse-server").ParseServer;
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const ParseDashboard = require("parse-dashboard");

const databaseUri = process.env.DB_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log("DB_URI not specified, falling back to localhost.");
}

const api = new ParseServer({
  databaseURI:
    databaseUri ||
    "mongodb+srv://admin:7156471564Paok!@travelblog-o4gud.mongodb.net/test?retryWrites=true&w=majority",
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + "/cloud/main.js",
  appId: process.env.APP_ID || "myAppId",
  masterKey: process.env.MASTER_KEY || "", //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL + "/parse" || "http://localhost:1337/parse", // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"], // List of classes to support for query subscriptions
  },
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

const app = express();

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || "/parse";
app.use(mountPath, api);

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

app.use("/", dashboard);
app.use("/dashboard", dashboard);

const port = process.env.SERVER_PORT || 1337;
const httpServer = require("http").createServer(app);
httpServer.listen(port, function() {
  console.log("parse-server-example running on port " + port + ".");
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
