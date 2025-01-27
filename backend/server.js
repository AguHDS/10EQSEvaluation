import cors from "cors";
import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.use("/src", express.static(path.join(__dirname, "../frontend/src")));

app.get("/api/saludo", (req, res) => {
  res.json({ message: "¡Hola desde la API!" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

const PORT = process.env.PORT_BACKEND
app.listen(PORT, () =>
  console.log(`Listening http://localhost:${PORT}`)
);
