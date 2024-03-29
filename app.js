// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const allRoutes = require("./routes/index.routes");
app.use("/", allRoutes);

const api = require('./routes/api.routes.js');
app.use('/api', api);

const auth = require('./routes/auth.routes.js');
app.use('/auth', auth);

const users = require('./routes/users.routes.js');
app.use('/users',isAuthenticated, users);

const business = require('./routes/business.routes.js');
app.use('/business', business);

const products = require('./routes/products.routes.js');
app.use('/products', products);

const orders = require('./routes/orders.routes.js');
app.use('/orders',isAuthenticated, orders);

const mails = require('./routes/mails.routes.js');
app.use('/mails',mails);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
