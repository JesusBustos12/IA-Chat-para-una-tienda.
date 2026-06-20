import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function testQuery() {
    if (!process.env.DATABASE_URL) return console.error("No DATABASE_URL");
    const dbUrl = process.env.DATABASE_URL.replace("?ssl=true", "");
    const connection = await mysql.createConnection({
        uri: dbUrl,
        ssl: { rejectUnauthorized: true }
    });
    
    const keywords = ["huevo", "huevos"];
    const likeClauses = keywords.map(() => "nombre LIKE ? OR marca LIKE ?").join(" OR ");
    const queryParams = [];
    keywords.forEach(kw => {
        queryParams.push(`%${kw}%`, `%${kw}%`);
    });

    const sqlQuery = `SELECT nombre, marca, costo, unidades_de_stock FROM productos WHERE ${likeClauses} LIMIT 20`;
    console.log("SQL:", sqlQuery);
    console.log("Params:", queryParams);
    
    const [rows] = await connection.execute(sqlQuery, queryParams);
    console.log("Resultados:", rows);
    await connection.end();
}

testQuery();
