import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./models/index.js";

// Configurar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Sincronizar base de datos SIN borrar tablas
await db.sequelize.sync({
  force: false
});

// Inicializar roles si no existen
const count = await db.role.count();

if (count === 0) {
  await db.role.bulkCreate([
    { id: 1, name: "user" },
    { id: 2, name: "moderator" },
    { id: 3, name: "admin" }
  ]);

  console.log("Roles creados");
}

// Importar rutas
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

// Usar rutas
authRoutes(app);
userRoutes(app);

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV}`);
});