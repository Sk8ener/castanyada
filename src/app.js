 /*Cargar los módulos para poderlos utilizar
const express = require("express");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");
const methodOverride = require("method-override"); // para "put"
const pool = require('./src/db');


// Crear la instancia del servidor
const app = express();

// Configurar algunos parámetros
process.loadEnvFile();
PORT = process.env.PORT || 6666;
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Obtener los datos
let productes = require("../data/pastisseria.json");

function crearMenu(json, lang) {
  let tipusProductes = [];
  let menu = "<ul>";

  if (lang === "cat") {
  json.forEach((producte) => {
    if (!tipusProductes.includes(producte.menu_name_cat)) {
      tipusProductes.push(producte.menu_name_cat);
    }
  });
} else {
  json.forEach((producte) => {
    if (!tipusProductes.includes(producte.menu_name_esp)) {
      tipusProductes.push(producte.menu_name_esp);
    }
  });
}

  tipusProductes.forEach((tipus) => {
    menu += `<li><a href="/${tipus.toLocaleLowerCase()}">${tipus}</a></li>`;
  });
  menu += "</ul>";
  return menu
}




// Ruta català
app.get("/", (req, res) => {
  // Realizar el menú
  const menu = crearMenu(sweets, "cat")
  res.render("index", { title: "Umm...!",menu, sweets, lang: "ESP" });
});
// Ruta raíz o inicial
app.get("/esp", (req, res) => {
  const menu = crearMenu(sweets, "esp")
  res.render("inicio", { title: "Umm...!", menu, sweets });
});

app.get("/admin", (req, res) => {
  res.render("admin", { title: "Gestió", menu, sweets });
});





app.post("/insert", (req, res) => {
  const body = req.body;
  body.id = crypto.randomUUID();
  //console.log(body);
  productes.push(body);
  fs.writeFileSync(
    path.join(__dirname, "../data", "pastisseria.json"),
    JSON.stringify(productes, null, 2),
    (err) => {
      if (err) throw err;
    }
  );
  // res.render("admin", { title: "administración", menu, travels });
  res.redirect("/admin")
});

// Ruta para manejar errores 404
app.use((req, res) => {
  res.render("404", { title: "Error 404", menu });
});

app.listen(PORT, () => {
  console.log(`Servidor arrancado en http://localhost:${PORT}`);
});
*/

// app.js
// src/app.js
/*const express = require('express');
const path = require('path');
const pool = require('./db'); // tu conexión MySQL en src/db.js

const app = express();

// Configuración EJS
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '../views'));

// Middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public'))); // carpeta public en raíz

// Ruta principal: listar productos
app.get('/', async (req, res) => {
    try {
        const [sweets] = await pool.query('SELECT * FROM sweets');

        console.table(sweets);
        res.render('index', { 
            sweets, 
            title: 'Inicio - Pastisseria',  // <-- agregamos title
            menu: ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta admin: formulario
app.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin - Pastisseria', menu: ''});
});


// Ruta insert: procesar formulario
app.post('/insert', async (req, res) => {
    try {
        const {
            menu_name_cat,
            name_cat,
            descripcio_cat,
            menu_name_esp,
            name_esp,
            descripcio_esp,
            preu,
            img
        } = req.body;

        // Convertir precio a decimal
        const precioDecimal = parseFloat(preu.replace(/[^\d.,]/g, '').replace(',', '.'));

        await pool.query(
            `INSERT INTO sweets 
            (menu_name_cat, name_cat, descripcio_cat, menu_name_esp, name_esp, descripcio_esp, preu, img)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [menu_name_cat, name_cat, descripcio_cat, menu_name_esp, name_esp, descripcio_esp, precioDecimal, img]
        );

        // Redirige a admin o a lista de productos
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al insertar producto');
    }
});

// Ruta 404
app.use((req, res) => {
    res.status(404).render('404');
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));*/

// src/app.js
const express = require('express');
const path = require('path');
const pool = require('./db'); // tu conexión MySQL en src/db.js

const app = express();

// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Función para crear menú dinámico desde la base de datos
async function crearMenu(lang = 'cat') {
    try {
        const [sweets] = await pool.query('SELECT * FROM sweets');
        const tipusProductes = [];

        sweets.forEach(product => {
            const nom = lang === 'cat' ? product.menu_name_cat : product.menu_name_esp;
            if (!tipusProductes.includes(nom)) tipusProductes.push(nom);
        });

        let menu = '<ul>';
        tipusProductes.forEach(tipus => {
            menu += `<li><a href="/${tipus.toLowerCase()}">${tipus}</a></li>`;
        });
        menu += '</ul>';
        return menu;
    } catch (err) {
        console.error('Error creando menú:', err);
        return '<ul></ul>';
    }
}

// Ruta principal (CAT)
app.get('/', async (req, res) => {
    try {
        const [sweets] = await pool.query('SELECT * FROM sweets');
        const menu = await crearMenu('cat');

        res.render('index', {
            title: 'Inicio - Pastisseria',
            menu,
            sweets,
            lang: 'CAT'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta ESP
app.get('/esp', async (req, res) => {
    try {
        const [sweets] = await pool.query('SELECT * FROM sweets');
        const menu = await crearMenu('esp');

        res.render('inicio', {
            title: 'Inicio - Pastelería',
            menu,
            sweets,
            lang: 'ESP'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta admin
app.get('/admin', async (req, res) => {
    try {
        const [sweets] = await pool.query('SELECT * FROM sweets');
        const menu = await crearMenu('cat');

        res.render('admin', {
            title: 'Admin - Pastisseria',
            menu,
            sweets
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los productos para admin');
    }
});

// Insertar producto
app.post('/insert', async (req, res) => {
    try {
        const {
            menu_name_cat,
            name_cat,
            descripcio_cat,
            menu_name_esp,
            name_esp,
            descripcio_esp,
            preu,
            img
        } = req.body;

        const precioDecimal = parseFloat(preu.replace(/[^\d.,]/g, '').replace(',', '.'));

        await pool.query(
            `INSERT INTO sweets 
            (menu_name_cat, name_cat, descripcio_cat, menu_name_esp, name_esp, descripcio_esp, preu, img)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [menu_name_cat, name_cat, descripcio_cat, menu_name_esp, name_esp, descripcio_esp, precioDecimal, img]
        );

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al insertar producto');
    }
});

// Ruta 404
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error 404', menu: '' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));

