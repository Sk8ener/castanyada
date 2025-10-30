const mysql = require('mysql2/promise');
const fs = require('fs');

async function main() {
  // 1️⃣ Leer JSON con utf-8
  
const data = JSON.parse(fs.readFileSync('data/pastisseria.json', 'utf-8'));

  // 2️⃣ Conectar a MySQL con utf8mb4 para soportar todos los caracteres
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'magda',
    password: 'magda',
    database: 'ummrene',
    charset: 'utf8mb4'
  });

  // 3️⃣ Limpiar la tabla antes de insertar (opcional)
  //await connection.execute('TRUNCATE TABLE sweets');

  // 4️⃣ Insertar datos
  for (const item of data) {
    // Extraer solo el número del precio (preu)
    const match = item.preu.match(/([\d.]+)/);
    const precio = match ? parseFloat(match[1]) : 0;

    await connection.execute(
      `INSERT INTO sweets 
      (menu_name_cat, name_cat, descripcio_cat, menu_name_esp, name_esp, descripcio_esp, preu, img)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.menu_name_cat,
        item.name_cat,
        item.descripcio_cat,
        item.menu_name_esp,
        item.name_esp,
        item.descripcio_esp,
        precio,
        item.img
      ]
    );
  }

  console.log('JSON importado correctamente en la tabla sweets con soporte UTF-8');
  await connection.end();
}

main().catch(console.error);
