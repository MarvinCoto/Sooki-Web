// Importo todo lo de la librería de Express
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import loginRoutes from "./src/routes/login.js"
import logoutRoutes from "./src/routes/logout.js"
import registerClientsRoutes from "./src/routes/registerClients.js"
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js"
import storesRoutes from "./src/routes/stores.js";
import productsRoutes from "./src/routes/products.js"
import categoriesRoutes from "./src/routes/categories.js"

//Creo una constante que es igual a la librería que importé
const app = express();

// ===== CORS =====
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With", "Accept", "Origin"],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
}));

// Middleware adicional para asegurar credentials en todas las respuestas
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// ===== PARSERS =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parser
app.use(cookieParser());

// ===== RUTAS =====
app.use("/api/stores", storesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);

app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/registerClients", registerClientsRoutes);
app.use("/api/recoveryPassword", recoveryPasswordRoutes);

//Exporto la constante para poder usar express en otros archivos
export default app;