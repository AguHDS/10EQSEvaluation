import cors from "cors";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import csv from "csvtojson";
import fs from "fs";

//routes
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/products", productRoutes);

const __dirname = path.resolve();
//serve static files (ex: images, css, js, etc...)
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use("/src", express.static(path.join(__dirname, "../frontend/src")));
app.use("/data", express.static(path.join(__dirname, "../frontend/data")));

//converts csv to json
app.get("/api/products", async (req, res) => {
  try {
    const csvFilePath = path.join(__dirname, "../frontend/data/products.csv");

    // Verifica que el archivo CSV existe
    if (!fs.existsSync(csvFilePath)) {
      return res.status(404).json({ error: "Archivo CSV no encontrado" });
    }

    const jsonArray = await csv().fromFile(csvFilePath);

    res.json(jsonArray);
  } catch (error) {
    console.error("Error al procesar el archivo CSV:", error);
    res.status(500).json({ error: "Error al procesar el archivo CSV" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

const PORT = process.env.PORT_BACKEND;
app.listen(PORT, () => console.log(`Listening http://localhost:${PORT}`));
