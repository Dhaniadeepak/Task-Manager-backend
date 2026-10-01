const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const connectDB = require("./config/db");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  connectDB().then(() =>
    app.listen(env.port, () => console.log(`Server running on port ${env.port}`))
  );
}

module.exports = app;
