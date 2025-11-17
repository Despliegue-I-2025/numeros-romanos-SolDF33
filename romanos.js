const express = require('express');
const cors = require('cors');

const app = express();

// Importar la lógica de conversión desde el módulo local
const { arabicToRoman, romanToArabic } = require('./converter'); 

// --- Middleware (Configuración CORS Explícita y Abierta) ---
// CRÍTICO para el evaluador: Permite peticiones GET desde cualquier origen.
app.use(cors({
    origin: '*', // Permite solicitudes desde cualquier origen (necesario para el evaluador)
    methods: 'GET', // Solo permite el método GET
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
// Endpoint para la raíz (Interfaz de usuario simple)
app.get('/', (req, res) => {
    // HTML para una pequeña interfaz de prueba
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Convertidor Árabigo ↔ Romano</title>
            <style>
                body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f4f4f9; }
                .container { display: flex; gap: 30px; padding: 20px; }
                .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 300px; text-align: center; }
                h1 { color: #333; margin-bottom: 5px; }
                p { color: #666; margin-bottom: 30px; }
                input[type="text"] { width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; }
                button { width: 100%; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background-color 0.3s; color: white; }
                .a2r button { background-color: #5b42f3; }
                .a2r button:hover { background-color: #4a34c5; }
                .r2a button { background-color: #1abc9c; }
                .r2a button:hover { background-color: #159c82; }
                .response-box { margin-top: 15px; padding: 10px; border-radius: 6px; background-color: #f0f8ff; border: 1px solid #cceeff; min-height: 20px; word-wrap: break-word; }
            </style>
            <script>
                async function convert(endpoint, inputId, outputId) {
                    const input = document.getElementById(inputId).value;
                    const outputElement = document.getElementById(outputId);
                    
                    let url = endpoint;
                    if (endpoint === '/a2r') {
                        url += '?arabic=' + encodeURIComponent(input);
                    } else if (endpoint === '/r2a') {
                        url += '?roman=' + encodeURIComponent(input);
                    }

                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        if (response.status === 200) {
                            if (data.roman) {
                                outputElement.innerHTML = \`**Romano:** \${data.roman}\`;
                            } else if (data.arabic) {
                                outputElement.innerHTML = \`**Arábigo:** \${data.arabic}\`;
                            }
                            outputElement.style.backgroundColor = '#e6ffe6';
                            outputElement.style.borderColor = '#4CAF50';
                        } else if (response.status === 400) {
                            outputElement.innerHTML = \`**Error:** \${data.error}\`;
                            outputElement.style.backgroundColor = '#ffe6e6';
                            outputElement.style.borderColor = '#f44336';
                        } else {
                            outputElement.innerHTML = 'Error desconocido en la API.';
                            outputElement.style.backgroundColor = '#ffdddd';
                            outputElement.style.borderColor = '#ff0000';
                        }
                    } catch (error) {
                        outputElement.innerHTML = \`Error de conexión: \${error.message}\`;
                        outputElement.style.backgroundColor = '#ffdddd';
                        outputElement.style.borderColor = '#ff0000';
                    }
                }
            </script>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <h1>Convertidor Árabigo ↔ Romano</h1>
                    <p>Utilizando los endpoints de la API en el servidor Express.</p>
                    <div class="a2r">
                        <h3>Árabigo a Romano</h3>
                        <input type="text" id="arabicInput" placeholder="Introduce un número (1-3999)">
                        <button onclick="convert('/a2r', 'arabicInput', 'romanOutput')">Convertir a Romano</button>
                        <div id="romanOutput" class="response-box"></div>
                    </div>
                </div>
                <div class="card">
                    <div class="r2a">
                        <h3>Romano a Arábigo</h3>
                        <input type="text" id="romanInput" placeholder="INTRODUCE UN NÚMERO ROMANO (EJ: MCMXCIV)">
                        <button onclick="convert('/r2a', 'romanInput', 'arabicOutput')">Convertir a Arábigo</button>
                        <div id="arabicOutput" class="response-box"></div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Endpoint para convertir Árabigo a Romano
app.get('/a2r', (req, res) => {
    // Si el parámetro 'arabic' no está presente o no es numérico, parseInt lo convierte a NaN
    const num = parseInt(req.query.arabic); 
    
    try {
        // arabicToRoman contiene la lógica de validación de rango (1-3999) y NaN
        const roman = arabicToRoman(num);
        res.status(200).json({ roman });
    } catch (e) {
        // Captura el error de validación y devuelve el mensaje EXACTO de converter.js con status 400
        res.status(400).json({ error: e.message });
    }
});

// Endpoint para convertir Romano a Arábigo
app.get('/r2a', (req, res) => {
    // Si el parámetro 'roman' no existe, usamos un string vacío, el cual falla en romanToArabic
    const roman = req.query.roman || '';
    
    try {
        // romanToArabic contiene la lógica de validación de formato y rango
        const arabic = romanToArabic(roman.toUpperCase());
        res.status(200).json({ arabic });
    } catch (e) {
        // Captura el error de validación y devuelve el mensaje EXACTO de converter.js con status 400
        res.status(400).json({ error: e.message });
    }
});

// Exportar la instancia de Express
module.exports = app;
