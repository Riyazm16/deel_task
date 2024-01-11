require("./utils/envConfig").config();
const express = require("express");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const cors = require("cors");
const swagger = require("../apiDocs/swagger");
const { logger } = require("./utils/logger");
const app = express();
app.disable("x-powered-by");
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());
app.disable("etag");
app.use(compression());
const setOrigin = "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", setOrigin);
  res.setHeader("Cache-Control", 9600);
  next();
});
app.use(require("./routes/api"));
const options = {
  customSiteTitle: "API Documentation",
};
app.use(
  "/api/docs",
  swagger.contract,
  swaggerUi.serve,
  swaggerUi.setup(null, options)
);

//global error and request handlers
app.use((req, res) => {
  const notFound = {
    message: "Endpoint not found",
  };
  logger.info(`404 url :  ${req.originalUrl}`);
  return res.status(404).json(notFound);
});

app.use((err, req, res) => {
  logger.info(`error url :  ${req.originalUrl}`);
  logger.error(err.stack);
  return res.status(500).json({
    message: "Something broke please try again after some time",
  });
});

process
  .on("unhandledRejection", (err) => {
    logger.error(err);
    logger.error("unhandledRejection thrown");
    process.exit(1);
  })
  .on("uncaughtException", (err) => {
    logger.error(err);
    logger.error("uncaughtException thrown");
    process.exit(1);
  });

module.exports = app;
