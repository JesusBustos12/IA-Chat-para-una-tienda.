import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const nuevosAbarrotes = [
    // 1-10: Cuidado personal y limpieza básica
    { id: 2000, nombre: "Jabón de Tocador Zote Rosa", marca: "Zote", costo: 18.50, fecha_de_caducidad: null, unidades_de_stock: 50 },
    { id: 2001, nombre: "Jabón Corporal Palmolive Naturals", marca: "Palmolive", costo: 22.00, fecha_de_caducidad: null, unidades_de_stock: 45 },
    { id: 2002, nombre: "Pasta Dental Colgate Triple Acción", marca: "Colgate", costo: 35.00, fecha_de_caducidad: "2027-01-01", unidades_de_stock: 60 },
    { id: 2003, nombre: "Shampoo Savilé Crecimiento", marca: "Savilé", costo: 42.50, fecha_de_caducidad: "2026-10-01", unidades_de_stock: 30 },
    { id: 2004, nombre: "Papel Higiénico Pétalo Rendimax", marca: "Pétalo", costo: 32.00, fecha_de_caducidad: null, unidades_de_stock: 100 },
    { id: 2005, nombre: "Detergente en Polvo Ariel Regular", marca: "Ariel", costo: 48.00, fecha_de_caducidad: null, unidades_de_stock: 25 },
    { id: 2006, nombre: "Suavizante Ensueño Color", marca: "Ensueño", costo: 26.50, fecha_de_caducidad: null, unidades_de_stock: 35 },
    { id: 2007, nombre: "Limpiador Fabuloso Lavanda", marca: "Fabuloso", costo: 28.00, fecha_de_caducidad: null, unidades_de_stock: 40 },
    { id: 2008, nombre: "Toallas Femeninas Saba", marca: "Saba", costo: 40.00, fecha_de_caducidad: "2028-05-01", unidades_de_stock: 55 },
    { id: 2009, nombre: "Desodorante Rexona Clinical", marca: "Rexona", costo: 65.00, fecha_de_caducidad: "2026-08-01", unidades_de_stock: 20 },

    // 11-20: Refrescos y bebidas
    { id: 2010, nombre: "Refresco Coca-Cola Regular 600ml", marca: "Coca-Cola", costo: 18.00, fecha_de_caducidad: "2025-12-01", unidades_de_stock: 120 },
    { id: 2011, nombre: "Refresco Pepsi 600ml", marca: "Pepsi", costo: 17.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 90 },
    { id: 2012, nombre: "Agua Purificada Bonafont 1L", marca: "Bonafont", costo: 14.00, fecha_de_caducidad: "2026-02-01", unidades_de_stock: 150 },
    { id: 2013, nombre: "Jugo Jumex Durazno 450ml", marca: "Jumex", costo: 21.00, fecha_de_caducidad: "2025-09-01", unidades_de_stock: 40 },
    { id: 2014, nombre: "Bebida Gatorade Naranja 500ml", marca: "Gatorade", costo: 26.00, fecha_de_caducidad: "2025-10-01", unidades_de_stock: 30 },
    { id: 2015, nombre: "Leche Entera Lala 1L", marca: "Lala", costo: 25.50, fecha_de_caducidad: "2025-01-15", unidades_de_stock: 60 },
    { id: 2016, nombre: "Leche Deslactosada Alpura 1L", marca: "Alpura", costo: 26.50, fecha_de_caducidad: "2025-01-20", unidades_de_stock: 50 },
    { id: 2017, nombre: "Café Soluble Nescafé Clásico", marca: "Nescafé", costo: 85.00, fecha_de_caducidad: "2026-12-01", unidades_de_stock: 25 },
    { id: 2018, nombre: "Té Manzanilla McCormick", marca: "McCormick", costo: 32.00, fecha_de_caducidad: "2027-04-01", unidades_de_stock: 40 },
    { id: 2019, nombre: "Bebida Energizante Red Bull", marca: "Red Bull", costo: 45.00, fecha_de_caducidad: "2026-03-01", unidades_de_stock: 30 },

    // 21-40: Despensa básica (Granos, pastas, salsas)
    { id: 2020, nombre: "Frijoles Refritos Peruanos", marca: "Isadora", costo: 22.00, fecha_de_caducidad: "2026-05-01", unidades_de_stock: 80 },
    { id: 2021, nombre: "Frijol Negro Verde Valle 1kg", marca: "Verde Valle", costo: 38.00, fecha_de_caducidad: "2026-12-01", unidades_de_stock: 45 },
    { id: 2022, nombre: "Arroz Súper Extra Verde Valle 1kg", marca: "Verde Valle", costo: 35.00, fecha_de_caducidad: "2026-11-01", unidades_de_stock: 50 },
    { id: 2023, nombre: "Pasta para Sopa de Fideo", marca: "La Moderna", costo: 9.50, fecha_de_caducidad: "2027-02-01", unidades_de_stock: 120 },
    { id: 2024, nombre: "Pasta para Sopa de Codo", marca: "La Moderna", costo: 9.50, fecha_de_caducidad: "2027-02-01", unidades_de_stock: 110 },
    { id: 2025, nombre: "Salsa Valentina Etiqueta Amarilla", marca: "Valentina", costo: 18.00, fecha_de_caducidad: "2026-09-01", unidades_de_stock: 65 },
    { id: 2026, nombre: "Salsa Catsup Del Monte", marca: "Del Monte", costo: 25.00, fecha_de_caducidad: "2026-06-01", unidades_de_stock: 40 },
    { id: 2027, nombre: "Mayonesa con Limón McCormick", marca: "McCormick", costo: 42.00, fecha_de_caducidad: "2025-10-01", unidades_de_stock: 35 },
    { id: 2028, nombre: "Aceite Vegetal Nutrioli 1L", marca: "Nutrioli", costo: 48.00, fecha_de_caducidad: "2026-08-01", unidades_de_stock: 50 },
    { id: 2029, nombre: "Aceite de Cártamo 123", marca: "123", costo: 42.00, fecha_de_caducidad: "2026-08-01", unidades_de_stock: 40 },
    { id: 2030, nombre: "Azúcar Estándar Zulka 1kg", marca: "Zulka", costo: 32.00, fecha_de_caducidad: null, unidades_de_stock: 80 },
    { id: 2031, nombre: "Sal de Mesa La Fina 1kg", marca: "La Fina", costo: 16.00, fecha_de_caducidad: null, unidades_de_stock: 90 },
    { id: 2032, nombre: "Cereal Zucaritas de Kellogg's", marca: "Kellogg's", costo: 55.00, fecha_de_caducidad: "2025-08-01", unidades_de_stock: 30 },
    { id: 2033, nombre: "Cereal Choco Krispis", marca: "Kellogg's", costo: 58.00, fecha_de_caducidad: "2025-08-01", unidades_de_stock: 25 },
    { id: 2034, nombre: "Avena Quaker 500g", marca: "Quaker", costo: 28.00, fecha_de_caducidad: "2026-01-01", unidades_de_stock: 40 },
    { id: 2035, nombre: "Leche Condensada La Lechera", marca: "Nestlé", costo: 26.00, fecha_de_caducidad: "2026-05-01", unidades_de_stock: 50 },
    { id: 2036, nombre: "Leche Evaporada Carnation", marca: "Nestlé", costo: 22.00, fecha_de_caducidad: "2026-04-01", unidades_de_stock: 60 },
    { id: 2037, nombre: "Pan Blanco Bimbo Grande", marca: "Bimbo", costo: 48.00, fecha_de_caducidad: "2025-01-15", unidades_de_stock: 30 },
    { id: 2038, nombre: "Tortillas de Harina Tía Rosa", marca: "Tía Rosa", costo: 24.00, fecha_de_caducidad: "2025-01-20", unidades_de_stock: 45 },
    { id: 2039, nombre: "Galletas Marías Gamesa", marca: "Gamesa", costo: 18.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 70 },

    // 41-70: Botanas, dulces y enlatados
    { id: 2040, nombre: "Sabritas Sal Originales", marca: "Sabritas", costo: 18.00, fecha_de_caducidad: "2025-06-01", unidades_de_stock: 80 },
    { id: 2041, nombre: "Doritos Nacho", marca: "Sabritas", costo: 18.00, fecha_de_caducidad: "2025-06-01", unidades_de_stock: 85 },
    { id: 2042, nombre: "Cheetos Torciditos Queso", marca: "Sabritas", costo: 16.00, fecha_de_caducidad: "2025-07-01", unidades_de_stock: 75 },
    { id: 2043, nombre: "Ruffles Queso", marca: "Sabritas", costo: 18.00, fecha_de_caducidad: "2025-06-01", unidades_de_stock: 60 },
    { id: 2044, nombre: "Cacahuates Japoneses Nishikawa", marca: "Nishikawa", costo: 14.00, fecha_de_caducidad: "2025-10-01", unidades_de_stock: 50 },
    { id: 2045, nombre: "Chocolates Carlos V", marca: "Nestlé", costo: 12.00, fecha_de_caducidad: "2026-02-01", unidades_de_stock: 100 },
    { id: 2046, nombre: "Gomitas Panditas Clásicos", marca: "Ricolino", costo: 15.00, fecha_de_caducidad: "2026-03-01", unidades_de_stock: 90 },
    { id: 2047, nombre: "Paleta Payaso", marca: "Ricolino", costo: 18.00, fecha_de_caducidad: "2025-09-01", unidades_de_stock: 40 },
    { id: 2048, nombre: "Atún en Agua Dolores", marca: "Dolores", costo: 22.50, fecha_de_caducidad: "2028-01-01", unidades_de_stock: 80 },
    { id: 2049, nombre: "Atún en Aceite Tuny", marca: "Tuny", costo: 21.00, fecha_de_caducidad: "2028-02-01", unidades_de_stock: 75 },
    { id: 2050, nombre: "Sardinas en Tomate Calmex", marca: "Calmex", costo: 35.00, fecha_de_caducidad: "2027-11-01", unidades_de_stock: 30 },
    { id: 2051, nombre: "Chiles Jalapeños en Escabeche La Costeña", marca: "La Costeña", costo: 18.00, fecha_de_caducidad: "2027-08-01", unidades_de_stock: 60 },
    { id: 2052, nombre: "Chiles Chipotle Adobados San Marcos", marca: "San Marcos", costo: 20.00, fecha_de_caducidad: "2027-09-01", unidades_de_stock: 55 },
    { id: 2053, nombre: "Elotes Dorados Herdez", marca: "Herdez", costo: 16.50, fecha_de_caducidad: "2027-05-01", unidades_de_stock: 45 },
    { id: 2054, nombre: "Chícharos enlatados Herdez", marca: "Herdez", costo: 15.00, fecha_de_caducidad: "2027-06-01", unidades_de_stock: 40 },
    { id: 2055, nombre: "Puré de Tomate Del Fuerte", marca: "Del Fuerte", costo: 9.00, fecha_de_caducidad: "2026-10-01", unidades_de_stock: 100 },
    { id: 2056, nombre: "Caldo de Pollo Knorr Suiza", marca: "Knorr", costo: 18.50, fecha_de_caducidad: "2026-12-01", unidades_de_stock: 80 },
    { id: 2057, nombre: "Sopa Maruchan Pollo", marca: "Maruchan", costo: 15.00, fecha_de_caducidad: "2026-03-01", unidades_de_stock: 150 },
    { id: 2058, nombre: "Sopa Nissin Res", marca: "Nissin", costo: 16.00, fecha_de_caducidad: "2026-04-01", unidades_de_stock: 120 },
    { id: 2059, nombre: "Galletas Oreo", marca: "Nabisco", costo: 22.00, fecha_de_caducidad: "2025-08-01", unidades_de_stock: 60 },
    { id: 2060, nombre: "Galletas Emperador Chocolate", marca: "Gamesa", costo: 20.00, fecha_de_caducidad: "2025-09-01", unidades_de_stock: 65 },
    { id: 2061, nombre: "Galletas Chokis", marca: "Gamesa", costo: 21.00, fecha_de_caducidad: "2025-09-01", unidades_de_stock: 55 },
    { id: 2062, nombre: "Pan Dulce Nito", marca: "Bimbo", costo: 18.00, fecha_de_caducidad: "2025-01-20", unidades_de_stock: 40 },
    { id: 2063, nombre: "Mantecadas Vainilla", marca: "Tía Rosa", costo: 25.00, fecha_de_caducidad: "2025-01-25", unidades_de_stock: 35 },
    { id: 2064, nombre: "Donas Espolvoreadas", marca: "Bimbo", costo: 26.00, fecha_de_caducidad: "2025-01-22", unidades_de_stock: 30 },
    { id: 2065, nombre: "Pingüinos Marinela", marca: "Marinela", costo: 24.00, fecha_de_caducidad: "2025-02-01", unidades_de_stock: 45 },
    { id: 2066, nombre: "Gansito Marinela", marca: "Marinela", costo: 18.00, fecha_de_caducidad: "2025-02-05", unidades_de_stock: 50 },
    { id: 2067, nombre: "Chocorroles", marca: "Marinela", costo: 22.00, fecha_de_caducidad: "2025-02-10", unidades_de_stock: 40 },
    { id: 2068, nombre: "Mermelada Fresa McCormick", marca: "McCormick", costo: 38.00, fecha_de_caducidad: "2026-11-01", unidades_de_stock: 30 },
    { id: 2069, nombre: "Cajeta Quemada Coronado", marca: "Coronado", costo: 45.00, fecha_de_caducidad: "2026-09-01", unidades_de_stock: 25 },

    // 71-100: Hogar, mascotas y varios
    { id: 2070, nombre: "Alimento Perros Pedigree Adulto 2kg", marca: "Pedigree", costo: 120.00, fecha_de_caducidad: "2026-05-01", unidades_de_stock: 20 },
    { id: 2071, nombre: "Alimento Perros Dog Chow 2kg", marca: "Purina", costo: 135.00, fecha_de_caducidad: "2026-06-01", unidades_de_stock: 18 },
    { id: 2072, nombre: "Alimento Gatos Whiskas Carne 1.5kg", marca: "Whiskas", costo: 110.00, fecha_de_caducidad: "2026-07-01", unidades_de_stock: 25 },
    { id: 2073, nombre: "Alimento Gatos Cat Chow 1.5kg", marca: "Purina", costo: 115.00, fecha_de_caducidad: "2026-08-01", unidades_de_stock: 22 },
    { id: 2074, nombre: "Insecticida Raid Casa y Jardín", marca: "Raid", costo: 65.00, fecha_de_caducidad: null, unidades_de_stock: 30 },
    { id: 2075, nombre: "Limpiador Cloralex El Chilor", marca: "Cloralex", costo: 22.00, fecha_de_caducidad: null, unidades_de_stock: 60 },
    { id: 2076, nombre: "Lavatrastes Salvo Limón", marca: "Salvo", costo: 38.00, fecha_de_caducidad: null, unidades_de_stock: 45 },
    { id: 2077, nombre: "Lavatrastes Axion Toque de Limón", marca: "Axion", costo: 36.00, fecha_de_caducidad: null, unidades_de_stock: 50 },
    { id: 2078, nombre: "Servilletas Pétalo 200pz", marca: "Pétalo", costo: 28.00, fecha_de_caducidad: null, unidades_de_stock: 70 },
    { id: 2079, nombre: "Bolsas para Basura Costalitos", marca: "Costalitos", costo: 45.00, fecha_de_caducidad: null, unidades_de_stock: 40 },
    { id: 2080, nombre: "Pilas Alcalinas AA Duracell 4pz", marca: "Duracell", costo: 110.00, fecha_de_caducidad: "2030-01-01", unidades_de_stock: 30 },
    { id: 2081, nombre: "Focos LED Philips 9W", marca: "Philips", costo: 55.00, fecha_de_caducidad: null, unidades_de_stock: 25 },
    { id: 2082, nombre: "Cerillos Clásicos La Central", marca: "La Central", costo: 8.00, fecha_de_caducidad: null, unidades_de_stock: 150 },
    { id: 2083, nombre: "Encendedor Bic Clásico", marca: "Bic", costo: 22.00, fecha_de_caducidad: null, unidades_de_stock: 60 },
    { id: 2084, nombre: "Shampoo Head & Shoulders Limpieza", marca: "Head & Shoulders", costo: 75.00, fecha_de_caducidad: "2027-02-01", unidades_de_stock: 20 },
    { id: 2085, nombre: "Crema Corporal Nivea Milk Nutritiva", marca: "Nivea", costo: 85.00, fecha_de_caducidad: "2026-10-01", unidades_de_stock: 18 },
    { id: 2086, nombre: "Crema Dental Oral-B", marca: "Oral-B", costo: 38.00, fecha_de_caducidad: "2027-05-01", unidades_de_stock: 35 },
    { id: 2087, nombre: "Mantequilla Gloria con Sal", marca: "Gloria", costo: 42.00, fecha_de_caducidad: "2025-02-15", unidades_de_stock: 20 },
    { id: 2088, nombre: "Margarina Primavera Chantilly", marca: "Primavera", costo: 28.00, fecha_de_caducidad: "2025-03-01", unidades_de_stock: 30 },
    { id: 2089, nombre: "Queso Panela Lala 400g", marca: "Lala", costo: 65.00, fecha_de_caducidad: "2025-01-20", unidades_de_stock: 15 },
    { id: 2090, nombre: "Queso Oaxaca Fud 400g", marca: "Fud", costo: 75.00, fecha_de_caducidad: "2025-01-25", unidades_de_stock: 12 },
    { id: 2091, nombre: "Jamón Virginia Fud 250g", marca: "Fud", costo: 48.00, fecha_de_caducidad: "2025-01-22", unidades_de_stock: 25 },
    { id: 2092, nombre: "Salchichas de Pavo San Rafael", marca: "San Rafael", costo: 55.00, fecha_de_caducidad: "2025-01-28", unidades_de_stock: 20 },
    { id: 2093, nombre: "Yogurt Bebible Danup Fresa", marca: "Danone", costo: 16.50, fecha_de_caducidad: "2025-01-18", unidades_de_stock: 45 },
    { id: 2094, nombre: "Yoghurt Yoplait Batido Fresa", marca: "Yoplait", costo: 14.00, fecha_de_caducidad: "2025-01-19", unidades_de_stock: 40 },
    { id: 2095, nombre: "Huevo San Juan Docena", marca: "San Juan", costo: 38.00, fecha_de_caducidad: "2025-02-01", unidades_de_stock: 30 },
    { id: 2096, nombre: "Huevo Bachoco Docena", marca: "Bachoco", costo: 39.00, fecha_de_caducidad: "2025-02-05", unidades_de_stock: 28 },
    { id: 2097, nombre: "Pan Molido Bimbo Clásico", marca: "Bimbo", costo: 22.00, fecha_de_caducidad: "2025-06-01", unidades_de_stock: 35 },
    { id: 2098, nombre: "Mole Doña María", marca: "Doña María", costo: 45.00, fecha_de_caducidad: "2027-01-01", unidades_de_stock: 40 },
    { id: 2099, nombre: "Salsa de Soya Kikkoman", marca: "Kikkoman", costo: 55.00, fecha_de_caducidad: "2028-05-01", unidades_de_stock: 15 }
];

async function seedAbarrotes() {
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
        console.log("Conectado a TiDB para insertar 100 abarrotes!");

        // Preparar lotes
        let values = [];
        for (const p of nuevosAbarrotes) {
            let fecha = p.fecha_de_caducidad;
            if (fecha === 'N/A' || fecha === '' || !fecha) {
                fecha = null;
            }
            values.push(p.id, p.nombre, p.marca, p.costo, fecha, p.unidades_de_stock);
        }

        const placeholders = nuevosAbarrotes.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
        
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
        
        console.log("¡100 nuevos productos insertados exitosamente!");
        await connection.end();
    } catch (error) {
        console.error("Error al insertar abarrotes:", error);
    }
}

seedAbarrotes();
