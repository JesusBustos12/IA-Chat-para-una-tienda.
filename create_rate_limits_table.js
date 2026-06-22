import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function createTable() {
    let connection;
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL no está configurada en .env");
        }

        const dbUrl = process.env.DATABASE_URL.replace("?ssl=true", "");
        connection = await mysql.createConnection({
            uri: dbUrl,
            ssl: {
                rejectUnauthorized: true
            }
        });

        console.log("Conectado a TiDB.");

        const query = `
            CREATE TABLE IF NOT EXISTS rate_limits (
                ip VARCHAR(45) PRIMARY KEY,
                last_request_date VARCHAR(10) NOT NULL,
                request_count INT DEFAULT 0
            );
        `;

        await connection.execute(query);
        console.log("✅ Tabla 'rate_limits' verificada/creada exitosamente.");

    } catch (error) {
        console.error("❌ Error al crear la tabla:", error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log("Conexión cerrada.");
        }
    }
}

createTable();
