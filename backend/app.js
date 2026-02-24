// Importo todo lo de la librería de Express
import express from "express";
import storesRoutes from "./src/routes/stores.js";
import cors from "cors";

//Creo una constante que es igual a la librería que importé
const app = express();

// 2. JSON parser
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.urlencoded({ extended: true }));


app.use("/api/stores", storesRoutes);

//Exporto la constante para poder usar express en otros archivos
export default app;