const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/combined.json");

const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://fishbone-app.onrender.com",
      "http://localhost:3000",
      "http://localhost:3001",
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send(
    '<h1>Welcome to Fishbone API</h1><p>Visit <a href="/api-docs">API Docs</a> for API documentation.</p>'
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
