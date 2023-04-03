import express, { Application } from "express";
import path from "path";
const cors = require("cors");

import { UserRoute, AdminRoute } from "../routes";

async function App(app: Application) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(express.json());

  app.use(cors());

  const imagePath = path.join(__dirname, "../images");

  app.use("/images", express.static(imagePath));

  app.use("/admin", AdminRoute);
  app.use("/user", UserRoute);

  return app;
}

module.exports = {
  App,
};
