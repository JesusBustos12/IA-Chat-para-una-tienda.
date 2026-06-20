import fs from "fs/promises";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const BATCH_SIZE = 100;

async function seed() {
    console.log("Iniciando migración de datos a TiDB...");

    if (!process.env.DATABASE_URL) {
        console.error("Error: DATABASE_URL no está definida en .env");
        process.exit(1);
    }

    try {
        const dbUrl = process.env.DATABASE_URL.replace("?ssl=true", "");
        const connection = await mysql.createConnection({
            uri: dbUrl,
            ssl: {
                rejectUnauthorized: true
            }
        });
        console.log("Conectado a TiDB!");

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS productos (
                id INT PRIMARY KEY,
                nombre VARCHAR(255),
                marca VARCHAR(255),
                costo DECIMAL(10, 2),
                fecha_de_caducidad DATE,
                unidades_de_stock INT
            )
        `);
        console.log("Tabla 'productos' verificada/creada.");

        const dataPath = path.join(process.cwd(), "productos.json");
        const fileContent = await fs.readFile(dataPath, "utf-8");
        const json = JSON.parse(fileContent);
        const productos = json.productos;
        
        console.log(`Total de productos a insertar: ${productos.length}`);

        for (let i = 0; i < productos.length; i += BATCH_SIZE) {
            const batch = productos.slice(i, i + BATCH_SIZE);
            const values = [];
            const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
            
            for (const p of batch) {
                let fecha = p.fecha_de_caducidad;
                if (fecha === 'N/A' || fecha === '' || !fecha) {
                    fecha = null;
                }
                values.push(p.id, p.nombre, p.marca, p.costo, fecha, p.unidades_de_stock);
            }
            
            await connection.execute(
                `INSERT INTO productos (id, nombre, marca, costo, fecha_de_caducidad, unidades_de_stock) 
                 VALUES ${placeholders} 
                 ON DUPLICATE KEY UPDATE 
                    nombre=VALUES(nombre), 
                    marca=VALUES(marca), 
                    costo=VALUES(costo), 
                    fecha_de_caducidad=VALUES(fecha_de_caducidad), 
                    unidades_de_stock=VALUES(unidades_de_stock)`,
                values
            );
            console.log(`Insertados/Actualizados registros del ${i + 1} al ${i + batch.length}`);
        }

        console.log("Migración completada exitosamente.");
        await connection.end();

    } catch (error) {
        console.error("Error durante la migración:", error);
        process.exit(1);
    }
}

seed();
