import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function fixDbAccents() {
    if (!process.env.DATABASE_URL) {
        console.error("No DATABASE_URL found.");
        process.exit(1);
    }

    try {
        const dbUrl = process.env.DATABASE_URL.replace("?ssl=true", "");
        const connection = await mysql.createConnection({
            uri: dbUrl,
            ssl: { rejectUnauthorized: true }
        });
        console.log("Conectado a TiDB...");

        console.log("Cambiando la colación de la tabla 'productos' a utf8mb4_unicode_ci para ignorar acentos y mayúsculas...");
        
        await connection.execute(`
            ALTER TABLE productos 
            CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);

        // Específicamente modificamos las columnas donde se hacen las búsquedas para asegurar la colación
        await connection.execute(`
            ALTER TABLE productos 
            MODIFY nombre VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY marca VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);
        
        console.log("¡Éxito! La base de datos ahora ignorará acentos (ej. 'azucar' == 'Azúcar').");
        await connection.end();
    } catch (error) {
        console.error("Error al modificar la base de datos:", error);
    }
}

fixDbAccents();
