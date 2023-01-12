// Este archivo es el que se lanza cuando arranca el servidor.

const path = require('path');
const express = require("express");
const cors = require("cors");
const fs = require('fs'); 
const app = express();
const db = require("./src/models");

var corsOptions = {
  origin: ["http://localhost:8081", 'http://127.0.0.1:5500', 'http://127.0.0.1:8080', 'http://localhost:3000']
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas de la API
var routePath="./src/routes/";

// Bucle que llama a todas las rutas de la API
fs.readdirSync(routePath).forEach(function(file) {
    require(routePath + file)(app);
});

// Sincronización con la base de datos.
db.sequelize.sync().then(() => {
    console.log("Sincronizado con la base de datos.");
}).catch((err) => {
    console.log("Fallo al sincronizar con la base de datos: " + err.message);
});

// Opertura del puerto 8080
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}.`);
});