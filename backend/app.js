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

// 2. JSON parser
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parser
app.use(cookieParser());


app.use("/api/stores", storesRoutes);
app.use("/api/products", productsRoutes)
app.use("/api/categories", categoriesRoutes)

app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/registerClients", registerClientsRoutes);
app.use("/api/recoveryPassword", recoveryPasswordRoutes)

//Exporto la constante para poder usar express en otros archivos
export default app;