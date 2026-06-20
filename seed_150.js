import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const nuevosAbarrotes = [
    // Lácteos y refrigerados
    { id: 2100, nombre: "Yogurt Griego Fresa Oikos", marca: "Danone", costo: 24.00, fecha_de_caducidad: "2025-02-15", unidades_de_stock: 30 },
    { id: 2101, nombre: "Yogurt Griego Natural Oikos", marca: "Danone", costo: 24.00, fecha_de_caducidad: "2025-02-15", unidades_de_stock: 25 },
    { id: 2102, nombre: "Crema Alpura 250ml", marca: "Alpura", costo: 22.00, fecha_de_caducidad: "2025-03-01", unidades_de_stock: 40 },
    { id: 2103, nombre: "Crema Lala 250ml", marca: "Lala", costo: 22.50, fecha_de_caducidad: "2025-03-01", unidades_de_stock: 40 },
    { id: 2104, nombre: "Queso Manchego Caperucita 400g", marca: "Caperucita", costo: 85.00, fecha_de_caducidad: "2025-04-10", unidades_de_stock: 15 },
    { id: 2105, nombre: "Queso Amarillo Kraft 8 Rebanadas", marca: "Kraft", costo: 35.00, fecha_de_caducidad: "2025-06-01", unidades_de_stock: 20 },
    { id: 2106, nombre: "Queso Crema Philadelphia 190g", marca: "Philadelphia", costo: 45.00, fecha_de_caducidad: "2025-05-15", unidades_de_stock: 25 },
    { id: 2107, nombre: "Leche Sabor Chocolate Santa Clara 250ml", marca: "Santa Clara", costo: 16.00, fecha_de_caducidad: "2025-02-28", unidades_de_stock: 40 },
    { id: 2108, nombre: "Leche Sabor Fresa Santa Clara 250ml", marca: "Santa Clara", costo: 16.00, fecha_de_caducidad: "2025-02-28", unidades_de_stock: 40 },
    { id: 2109, nombre: "Mantequilla sin sal Lyncott", marca: "Lyncott", costo: 45.00, fecha_de_caducidad: "2025-04-20", unidades_de_stock: 20 },

    // Bebidas
    { id: 2110, nombre: "Agua Mineral Topo Chico 600ml", marca: "Topo Chico", costo: 18.00, fecha_de_caducidad: "2026-01-01", unidades_de_stock: 60 },
    { id: 2111, nombre: "Agua Mineral Peñafiel 600ml", marca: "Peñafiel", costo: 16.00, fecha_de_caducidad: "2026-01-01", unidades_de_stock: 50 },
    { id: 2112, nombre: "Refresco Sprite 600ml", marca: "Coca-Cola", costo: 18.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 60 },
    { id: 2113, nombre: "Refresco Fanta Naranja 600ml", marca: "Coca-Cola", costo: 18.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 60 },
    { id: 2114, nombre: "Refresco Fresca 600ml", marca: "Coca-Cola", costo: 18.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 40 },
    { id: 2115, nombre: "Refresco Manzanita Sol 600ml", marca: "Pepsi", costo: 17.00, fecha_de_caducidad: "2025-10-01", unidades_de_stock: 45 },
    { id: 2116, nombre: "Refresco 7Up 600ml", marca: "Pepsi", costo: 17.00, fecha_de_caducidad: "2025-10-01", unidades_de_stock: 45 },
    { id: 2117, nombre: "Refresco Mirinda 600ml", marca: "Pepsi", costo: 17.00, fecha_de_caducidad: "2025-10-01", unidades_de_stock: 45 },
    { id: 2118, nombre: "Jugo del Valle Mango 413ml", marca: "Del Valle", costo: 20.00, fecha_de_caducidad: "2025-08-01", unidades_de_stock: 35 },
    { id: 2119, nombre: "Jugo del Valle Manzana 413ml", marca: "Del Valle", costo: 20.00, fecha_de_caducidad: "2025-08-01", unidades_de_stock: 35 },
    { id: 2120, nombre: "Té Lipton Limón 600ml", marca: "Lipton", costo: 21.00, fecha_de_caducidad: "2025-09-01", unidades_de_stock: 30 },
    { id: 2121, nombre: "Té Fuze Tea Durazno 600ml", marca: "Fuze Tea", costo: 22.00, fecha_de_caducidad: "2025-09-01", unidades_de_stock: 35 },
    { id: 2122, nombre: "Agua Ciel 1L", marca: "Ciel", costo: 14.00, fecha_de_caducidad: "2026-03-01", unidades_de_stock: 80 },
    { id: 2123, nombre: "Agua Epura 1L", marca: "Epura", costo: 14.00, fecha_de_caducidad: "2026-03-01", unidades_de_stock: 80 },
    { id: 2124, nombre: "Suero Electrolit Fresa", marca: "Electrolit", costo: 32.00, fecha_de_caducidad: "2026-05-01", unidades_de_stock: 40 },
    { id: 2125, nombre: "Suero Electrolit Coco", marca: "Electrolit", costo: 32.00, fecha_de_caducidad: "2026-05-01", unidades_de_stock: 40 },
    { id: 2126, nombre: "Suero Suerox Mora Azul", marca: "Suerox", costo: 28.00, fecha_de_caducidad: "2026-06-01", unidades_de_stock: 35 },
    { id: 2127, nombre: "Bebida Energizante Monster Energy 473ml", marca: "Monster", costo: 42.00, fecha_de_caducidad: "2026-02-01", unidades_de_stock: 30 },
    { id: 2128, nombre: "Bebida Energizante Vive100", marca: "Vive100", costo: 18.00, fecha_de_caducidad: "2025-12-01", unidades_de_stock: 50 },
    { id: 2129, nombre: "Bebida Energizante Amper", marca: "Amper", costo: 17.00, fecha_de_caducidad: "2025-12-01", unidades_de_stock: 40 },

    // Botanas
    { id: 2130, nombre: "Takis Fuego 62g", marca: "Barcel", costo: 20.00, fecha_de_caducidad: "2025-08-01", unidades_de_stock: 70 },
    { id: 2131, nombre: "Chips Jalapeño 60g", marca: "Barcel", costo: 22.00, fecha_de_caducidad: "2025-08-01", unidades_de_stock: 60 },
    { id: 2132, nombre: "Chips Fuego 60g", marca: "Barcel", costo: 22.00, fecha_de_caducidad: "2025-08-01", unidades_de_stock: 55 },
    { id: 2133, nombre: "Runners", marca: "Barcel", costo: 18.00, fecha_de_caducidad: "2025-07-01", unidades_de_stock: 40 },
    { id: 2134, nombre: "Tostitos Salsa Verde 65g", marca: "Sabritas", costo: 19.00, fecha_de_caducidad: "2025-07-01", unidades_de_stock: 50 },
    { id: 2135, nombre: "Fritos Sal y Limón 57g", marca: "Sabritas", costo: 17.00, fecha_de_caducidad: "2025-06-01", unidades_de_stock: 45 },
    { id: 2136, nombre: "Churrumais con Limón", marca: "Sabritas", costo: 15.00, fecha_de_caducidad: "2025-06-01", unidades_de_stock: 60 },
    { id: 2137, nombre: "Crujitos Queso", marca: "Sabritas", costo: 16.00, fecha_de_caducidad: "2025-06-01", unidades_de_stock: 40 },
    { id: 2138, nombre: "Rancheritos", marca: "Sabritas", costo: 16.00, fecha_de_caducidad: "2025-06-01", unidades_de_stock: 50 },
    { id: 2139, nombre: "Cacahuates Mafer Salados 65g", marca: "Mafer", costo: 22.00, fecha_de_caducidad: "2025-09-01", unidades_de_stock: 30 },
    { id: 2140, nombre: "Cacahuates Hot Nuts Original 50g", marca: "Barcel", costo: 18.00, fecha_de_caducidad: "2025-09-01", unidades_de_stock: 40 },
    { id: 2141, nombre: "Semillas de Girasol Sol", marca: "Sol", costo: 12.00, fecha_de_caducidad: "2025-10-01", unidades_de_stock: 50 },
    { id: 2142, nombre: "Pistaches Mafer 60g", marca: "Mafer", costo: 45.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 15 },
    { id: 2143, nombre: "Almendras Mafer 60g", marca: "Mafer", costo: 40.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 15 },
    { id: 2144, nombre: "Gomitas Skwinkles Salsagheti", marca: "Lucas", costo: 14.00, fecha_de_caducidad: "2025-12-01", unidades_de_stock: 40 },
    { id: 2145, nombre: "Dulce Lucas Muecas Mango", marca: "Lucas", costo: 12.00, fecha_de_caducidad: "2026-01-01", unidades_de_stock: 50 },
    { id: 2146, nombre: "Dulce Lucas Gusano", marca: "Lucas", costo: 10.00, fecha_de_caducidad: "2026-01-01", unidades_de_stock: 55 },
    { id: 2147, nombre: "Pelón Pelo Rico Original", marca: "Pelón", costo: 10.00, fecha_de_caducidad: "2026-02-01", unidades_de_stock: 80 },
    { id: 2148, nombre: "Tamborines", marca: "Dulces Vero", costo: 2.50, fecha_de_caducidad: "2026-03-01", unidades_de_stock: 100 },
    { id: 2149, nombre: "Paleta Tarrito", marca: "Dulces Vero", costo: 3.50, fecha_de_caducidad: "2026-03-01", unidades_de_stock: 80 },

    // Abarrotes y Despensa
    { id: 2150, nombre: "Atún en Agua Herdez", marca: "Herdez", costo: 21.50, fecha_de_caducidad: "2028-04-01", unidades_de_stock: 50 },
    { id: 2151, nombre: "Mayonesa Hellmann's Clásica", marca: "Hellmann's", costo: 40.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 30 },
    { id: 2152, nombre: "Mostaza McCormick 260g", marca: "McCormick", costo: 18.00, fecha_de_caducidad: "2026-05-01", unidades_de_stock: 25 },
    { id: 2153, nombre: "Miel Carlota 500g", marca: "Carlota", costo: 85.00, fecha_de_caducidad: "2027-01-01", unidades_de_stock: 15 },
    { id: 2154, nombre: "Café Legal Soluble", marca: "Legal", costo: 45.00, fecha_de_caducidad: "2026-10-01", ঐতিহ্য: 25, unidades_de_stock: 30 },
    { id: 2155, nombre: "Café Oro Soluble 100g", marca: "Oro", costo: 55.00, fecha_de_caducidad: "2026-11-01", unidades_de_stock: 25 },
    { id: 2156, nombre: "Chocolate Abuelita Mesa", marca: "Nestlé", costo: 85.00, fecha_de_caducidad: "2026-07-01", unidades_de_stock: 20 },
    { id: 2157, nombre: "Chocolate Ibarra Mesa", marca: "Ibarra", costo: 80.00, fecha_de_caducidad: "2026-06-01", unidades_de_stock: 20 },
    { id: 2158, nombre: "Polvo para preparar Choco Milk", marca: "Choco Milk", costo: 45.00, fecha_de_caducidad: "2026-08-01", unidades_de_stock: 25 },
    { id: 2159, nombre: "Polvo para preparar Nesquik", marca: "Nestlé", costo: 48.00, fecha_de_caducidad: "2026-09-01", unidades_de_stock: 25 },
    { id: 2160, nombre: "Salsa Casera Herdez 210g", marca: "Herdez", costo: 18.00, fecha_de_caducidad: "2027-02-01", unidades_de_stock: 40 },
    { id: 2161, nombre: "Salsa Verde Herdez 210g", marca: "Herdez", costo: 18.00, fecha_de_caducidad: "2027-02-01", unidades_de_stock: 40 },
    { id: 2162, nombre: "Salsa Botanera", marca: "Botanera", costo: 16.00, fecha_de_caducidad: "2026-12-01", unidades_de_stock: 45 },
    { id: 2163, nombre: "Salsa Búfalo Clásica", marca: "Búfalo", costo: 15.00, fecha_de_caducidad: "2026-11-01", unidades_de_stock: 35 },
    { id: 2164, nombre: "Consomé de Pollo Rico Pollo", marca: "Rico Pollo", costo: 16.00, fecha_de_caducidad: "2026-09-01", unidades_de_stock: 50 },
    { id: 2165, nombre: "Pasta Yemina Spaghetti", marca: "Yemina", costo: 12.00, fecha_de_caducidad: "2027-05-01", unidades_de_stock: 60 },
    { id: 2166, nombre: "Pasta Barilla Penne Rigate", marca: "Barilla", costo: 28.00, fecha_de_caducidad: "2027-06-01", unidades_de_stock: 20 },
    { id: 2167, nombre: "Frijoles Bayos La Sierra Refritos", marca: "La Sierra", costo: 21.00, fecha_de_caducidad: "2026-07-01", unidades_de_stock: 40 },
    { id: 2168, nombre: "Frijoles Negros La Sierra Refritos", marca: "La Sierra", costo: 21.00, fecha_de_caducidad: "2026-07-01", unidades_de_stock: 40 },
    { id: 2169, nombre: "Chiles Serranos La Costeña", marca: "La Costeña", costo: 19.00, fecha_de_caducidad: "2027-04-01", unidades_de_stock: 35 },
    { id: 2170, nombre: "Lentejas Verde Valle 500g", marca: "Verde Valle", costo: 32.00, fecha_de_caducidad: "2026-10-01", unidades_de_stock: 25 },
    { id: 2171, nombre: "Garbanzo Verde Valle 500g", marca: "Verde Valle", costo: 35.00, fecha_de_caducidad: "2026-11-01", unidades_de_stock: 20 },
    { id: 2172, nombre: "Maíz Palomero Verde Valle 500g", marca: "Verde Valle", costo: 24.00, fecha_de_caducidad: "2026-08-01", unidades_de_stock: 30 },
    { id: 2173, nombre: "Harina de Trigo San Antonio 1kg", marca: "San Antonio", costo: 22.00, fecha_de_caducidad: "2026-05-01", unidades_de_stock: 40 },
    { id: 2174, nombre: "Harina para Hot Cakes Gamesa 500g", marca: "Gamesa", costo: 35.00, fecha_de_caducidad: "2026-03-01", unidades_de_stock: 35 },
    { id: 2175, nombre: "Jarabe Maple Karo", marca: "Karo", costo: 45.00, fecha_de_caducidad: "2026-09-01", unidades_de_stock: 20 },
    { id: 2176, nombre: "Vinagre Blanco Clemente Jacques 500ml", marca: "Clemente Jacques", costo: 16.00, fecha_de_caducidad: "2027-01-01", unidades_de_stock: 30 },
    { id: 2177, nombre: "Vinagre de Manzana Clemente Jacques 500ml", marca: "Clemente Jacques", costo: 18.00, fecha_de_caducidad: "2027-01-01", unidades_de_stock: 25 },
    { id: 2178, nombre: "Aceite Capullo 1L", marca: "Capullo", costo: 55.00, fecha_de_caducidad: "2026-04-01", unidades_de_stock: 30 },
    { id: 2179, nombre: "Manteca de Cerdo Inca 500g", marca: "Inca", costo: 42.00, fecha_de_caducidad: "2026-02-01", unidades_de_stock: 20 },

    // Cuidado Personal
    { id: 2180, nombre: "Shampoo Pantene Restauración", marca: "Pantene", costo: 65.00, fecha_de_caducidad: "2027-03-01", unidades_de_stock: 25 },
    { id: 2181, nombre: "Acondicionador Pantene Restauración", marca: "Pantene", costo: 65.00, fecha_de_caducidad: "2027-03-01", unidades_de_stock: 20 },
    { id: 2182, nombre: "Shampoo Caprice Manzana", marca: "Caprice", costo: 35.00, fecha_de_caducidad: "2027-05-01", unidades_de_stock: 30 },
    { id: 2183, nombre: "Jabón de Tocador Camay Clásico", marca: "Camay", costo: 18.00, fecha_de_caducidad: null, unidades_de_stock: 45 },
    { id: 2184, nombre: "Jabón de Tocador Escudo Antibacterial", marca: "Escudo", costo: 20.00, fecha_de_caducidad: null, unidades_de_stock: 50 },
    { id: 2185, nombre: "Jabón de Tocador Dove Original", marca: "Dove", costo: 28.00, fecha_de_caducidad: null, unidades_de_stock: 30 },
    { id: 2186, nombre: "Pasta Dental Crest Anti-Caries", marca: "Crest", costo: 32.00, fecha_de_caducidad: "2027-06-01", unidades_de_stock: 40 },
    { id: 2187, nombre: "Enjuague Bucal Listerine Cool Mint 250ml", marca: "Listerine", costo: 65.00, fecha_de_caducidad: "2026-08-01", unidades_de_stock: 15 },
    { id: 2188, nombre: "Cepillos Dentales Colgate 2pz", marca: "Colgate", costo: 45.00, fecha_de_caducidad: null, unidades_de_stock: 25 },
    { id: 2189, nombre: "Desodorante Obao Roll-on Femenino", marca: "Obao", costo: 35.00, fecha_de_caducidad: "2026-11-01", unidades_de_stock: 30 },
    { id: 2190, nombre: "Desodorante Stefano Men Aerosol", marca: "Stefano", costo: 55.00, fecha_de_caducidad: "2026-10-01", unidades_de_stock: 20 },
    { id: 2191, nombre: "Toallas Femeninas Naturella", marca: "Naturella", costo: 38.00, fecha_de_caducidad: "2027-01-01", unidades_de_stock: 35 },
    { id: 2192, nombre: "Toallas Femeninas Kotex Nocturnas", marca: "Kotex", costo: 42.00, fecha_de_caducidad: "2027-02-01", unidades_de_stock: 30 },
    { id: 2193, nombre: "Protectores Diarios Saba", marca: "Saba", costo: 28.00, fecha_de_caducidad: "2027-04-01", unidades_de_stock: 25 },
    { id: 2194, nombre: "Rastrillos Gillette Prestobarba 2pz", marca: "Gillette", costo: 45.00, fecha_de_caducidad: null, unidades_de_stock: 40 },
    { id: 2195, nombre: "Espuma para Afeitar Gillette", marca: "Gillette", costo: 65.00, fecha_de_caducidad: "2026-12-01", unidades_de_stock: 15 },
    { id: 2196, nombre: "Gel Fijador Ego", marca: "Ego", costo: 25.00, fecha_de_caducidad: "2026-07-01", unidades_de_stock: 35 },
    { id: 2197, nombre: "Gel Fijador Xtreme", marca: "Xtreme", costo: 28.00, fecha_de_caducidad: "2026-06-01", unidades_de_stock: 30 },
    { id: 2198, nombre: "Algodón Plisado Jaloma 50g", marca: "Jaloma", costo: 18.00, fecha_de_caducidad: null, unidades_de_stock: 40 },
    { id: 2199, nombre: "Hisopos (Cotonetes) Johnson's 100pz", marca: "Johnson's", costo: 35.00, fecha_de_caducidad: null, unidades_de_stock: 25 },

    // Limpieza y Hogar
    { id: 2200, nombre: "Detergente en Polvo Foca 1kg", marca: "Foca", costo: 45.00, fecha_de_caducidad: null, unidades_de_stock: 40 },
    { id: 2201, nombre: "Detergente en Polvo Roma 1kg", marca: "Roma", costo: 42.00, fecha_de_caducidad: null, unidades_de_stock: 45 },
    { id: 2202, nombre: "Detergente en Polvo Blanca Nieves 1kg", marca: "Blanca Nieves", costo: 44.00, fecha_de_caducidad: null, unidades_de_stock: 35 },
    { id: 2203, nombre: "Detergente Líquido Más Color 1L", marca: "Más", costo: 65.00, fecha_de_caducidad: null, unidades_de_stock: 20 },
    { id: 2204, nombre: "Suavizante Suavitel Fresca Primavera 850ml", marca: "Suavitel", costo: 28.00, fecha_de_caducidad: null, unidades_de_stock: 50 },
    { id: 2205, nombre: "Suavizante Downy Libre Enjuague 850ml", marca: "Downy", costo: 32.00, fecha_de_caducidad: null, unidades_de_stock: 40 },
    { id: 2206, nombre: "Jabón de Lavandería Lirio", marca: "Lirio", costo: 20.00, fecha_de_caducidad: null, unidades_de_stock: 45 },
    { id: 2207, nombre: "Jabón de Lavandería Tepeyac", marca: "Tepeyac", costo: 19.00, fecha_de_caducidad: null, unidades_de_stock: 40 },
    { id: 2208, nombre: "Cloro Los Pinos 1L", marca: "Los Pinos", costo: 15.00, fecha_de_caducidad: null, unidades_de_stock: 60 },
    { id: 2209, nombre: "Limpiador Pinol Original 828ml", marca: "Pinol", costo: 32.00, fecha_de_caducidad: null, unidades_de_stock: 45 },
    { id: 2210, nombre: "Limpiador Maestro Limpio Limón", marca: "Maestro Limpio", costo: 35.00, fecha_de_caducidad: null, unidades_de_stock: 30 },
    { id: 2211, nombre: "Fibras Esponja Scotch-Brite", marca: "Scotch-Brite", costo: 22.00, fecha_de_caducidad: null, unidades_de_stock: 40 },
    { id: 2212, nombre: "Fibra Metálica para Trastes", marca: "Genérica", costo: 10.00, fecha_de_caducidad: null, unidades_de_stock: 60 },
    { id: 2213, rollos: 4, nombre: "Papel Higiénico Regio Rinde Más 4 Rollos", marca: "Regio", costo: 38.00, fecha_de_caducidad: null, unidades_de_stock: 50 },
    { id: 2214, nombre: "Papel Higiénico Suavel 4 Rollos", marca: "Suavel", costo: 30.00, fecha_de_caducidad: null, unidades_de_stock: 55 },
    { id: 2215, nombre: "Toallas de Papel Nova", marca: "Nova", costo: 25.00, fecha_de_caducidad: null, unidades_de_stock: 40 },
    { id: 2216, nombre: "Aluminio Reynolds 8m", marca: "Reynolds", costo: 38.00, fecha_de_caducidad: null, unidades_de_stock: 25 },
    { id: 2217, nombre: "Película Plástica Egapack", marca: "Egapack", costo: 42.00, fecha_de_caducidad: null, unidades_de_stock: 20 },
    { id: 2218, nombre: "Vasos Desechables de Plástico #8 50pz", marca: "Reyma", costo: 35.00, fecha_de_caducidad: null, unidades_de_stock: 30 },
    { id: 2219, nombre: "Platos Desechables Térmicos 25pz", marca: "Reyma", costo: 38.00, fecha_de_caducidad: null, unidades_de_stock: 30 },
    { id: 2220, nombre: "Cucharas de Plástico 50pz", marca: "Reyma", costo: 25.00, fecha_de_caducidad: null, unidades_de_stock: 40 },
    { id: 2221, nombre: "Bolsas de Polietileno Transparentes 1kg", marca: "Genérica", costo: 55.00, fecha_de_caducidad: null, unidades_de_stock: 15 },
    { id: 2222, nombre: "Cinta Adhesiva Canela 50m", marca: "Janel", costo: 28.00, fecha_de_caducidad: null, unidades_de_stock: 20 },
    { id: 2223, nombre: "Pegamento Blanco Resistol 850 110g", marca: "Resistol", costo: 32.00, fecha_de_caducidad: null, unidades_de_stock: 25 },
    { id: 2224, nombre: "Kola Loka Gotero", marca: "Kola Loka", costo: 25.00, fecha_de_caducidad: null, unidades_de_stock: 40 },

    // Bebidas alcohólicas (si la tienda tiene permiso, comunes en abarrotes)
    { id: 2225, nombre: "Cerveza Corona Extra 355ml", marca: "Corona", costo: 22.00, fecha_de_caducidad: "2025-10-01", unidades_de_stock: 100 },
    { id: 2226, nombre: "Cerveza Victoria 355ml", marca: "Victoria", costo: 22.00, fecha_de_caducidad: "2025-10-01", unidades_de_stock: 100 },
    { id: 2227, nombre: "Cerveza Modelo Especial Caguama", marca: "Modelo", costo: 45.00, fecha_de_caducidad: "2025-09-01", unidades_de_stock: 40 },
    { id: 2228, nombre: "Cerveza Tecate Light 355ml", marca: "Tecate", costo: 21.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 80 },
    { id: 2229, nombre: "Cerveza Indio 355ml", marca: "Indio", costo: 21.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 60 },

    // Helados y postres
    { id: 2230, nombre: "Helado Holanda Napolitano 1L", marca: "Holanda", costo: 75.00, fecha_de_caducidad: "2025-06-01", unidades_de_stock: 15 },
    { id: 2231, nombre: "Paleta Magnum Almendras", marca: "Holanda", costo: 38.00, fecha_de_caducidad: "2025-07-01", unidades_de_stock: 20 },
    { id: 2232, nombre: "Mordisko de Chocolate", marca: "Holanda", costo: 22.00, fecha_de_caducidad: "2025-08-01", unidades_de_stock: 25 },
    { id: 2233, nombre: "Cornetto Clásico", marca: "Holanda", costo: 28.00, fecha_de_caducidad: "2025-08-01", unidades_de_stock: 25 },
    { id: 2234, nombre: "Paleta Solero de Mango", marca: "Holanda", costo: 25.00, fecha_de_caducidad: "2025-09-01", unidades_de_stock: 20 },

    // Medicamentos OTC / Botiquín básico
    { id: 2235, nombre: "Paracetamol 500mg 10 Tabletas", marca: "Genérico", costo: 25.00, fecha_de_caducidad: "2027-01-01", unidades_de_stock: 40 },
    { id: 2236, nombre: "Aspirina 500mg 40 Tabletas", marca: "Bayer", costo: 45.00, fecha_de_caducidad: "2027-02-01", unidades_de_stock: 25 },
    { id: 2237, nombre: "Pepto Bismol Líquido 118ml", marca: "Pepto Bismol", costo: 75.00, fecha_de_caducidad: "2026-11-01", unidades_de_stock: 15 },
    { id: 2238, nombre: "Alka-Seltzer Antiácido 12 Tabletas", marca: "Bayer", costo: 35.00, fecha_de_caducidad: "2026-10-01", unidades_de_stock: 30 },
    { id: 2239, nombre: "Sal de Uvas Picot Polvo 4 Sobres", marca: "Picot", costo: 20.00, fecha_de_caducidad: "2027-05-01", unidades_de_stock: 50 },
    { id: 2240, nombre: "Curitas Tela Elástica 20pz", marca: "Curitas", costo: 25.00, fecha_de_caducidad: "2028-01-01", unidades_de_stock: 35 },
    { id: 2241, nombre: "Alcohol Etílico Jaloma 250ml", marca: "Jaloma", costo: 30.00, fecha_de_caducidad: "2028-06-01", unidades_de_stock: 25 },
    { id: 2242, nombre: "Agua Oxigenada Jaloma 250ml", marca: "Jaloma", costo: 28.00, fecha_de_caducidad: "2027-08-01", unidades_de_stock: 25 },
    { id: 2243, nombre: "Merthiolate Tintura", marca: "Bayer", costo: 45.00, fecha_de_caducidad: "2027-04-01", unidades_de_stock: 15 },
    { id: 2244, nombre: "Vick VapoRub Ungüento 50g", marca: "Vick", costo: 65.00, fecha_de_caducidad: "2026-12-01", unidades_de_stock: 20 },

    // Extras de comida
    { id: 2245, nombre: "Chicles Trident Menta", marca: "Trident", costo: 12.00, fecha_de_caducidad: "2025-11-01", unidades_de_stock: 60 },
    { id: 2246, nombre: "Chicles Clorets", marca: "Clorets", costo: 10.00, fecha_de_caducidad: "2025-10-01", unidades_de_stock: 60 },
    { id: 2247, nombre: "Chicles Bubbaloo Fresa", marca: "Bubbaloo", costo: 2.00, fecha_de_caducidad: "2026-01-01", unidades_de_stock: 150 },
    { id: 2248, nombre: "Pastillas Halls Mentol", marca: "Halls", costo: 12.00, fecha_de_caducidad: "2026-02-01", unidades_de_stock: 80 },
    { id: 2249, nombre: "Pastillas Tic Tac Menta", marca: "Tic Tac", costo: 15.00, fecha_de_caducidad: "2026-03-01", unidades_de_stock: 50 }
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
        console.log("Conectado a TiDB para insertar 150 abarrotes adicionales!");

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
        
        console.log("¡150 nuevos productos insertados exitosamente!");
        await connection.end();
    } catch (error) {
        console.error("Error al insertar abarrotes:", error);
    }
}

seedAbarrotes();
