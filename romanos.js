const express = require('express');
const cors = require('cors');

const app = express();

// Importar la lógica de conversión
const { arabicToRoman, romanToArabic } = require('./converter'); 

// --- Middleware ---
app.use(cors());
app.use(express.json()); 

// --- Endpoints de la API ---

// Endpoint raíz para servir la interfaz de usuario del convertidor
/* istanbul ignore next */ 
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convertidor de Números Romanos API</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Fuente Inter (Opcional) */
        body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; background-color: #f7f7f7; }
        /* Animación de carga */
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .spinner {
            display: none;
            width: 24px;
            height: 24px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #ffffff;
            animation: spin 1s linear infinite;
        }
        .loading .spinner { display: inline-block; }
        .loading #arabicBtnText, .loading #romanBtnText { display: none; }
    </style>
</head>
<body class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 space-y-8">
        <h1 class="text-3xl font-bold text-center text-indigo-700">Convertidor Árabigo ↔ Romano</h1>
        <p class="text-center text-gray-500">Utilizando los endpoints de la API en el servidor Express.</p>

        <div class="grid md:grid-cols-2 gap-8">

            <div class="bg-indigo-50 p-6 rounded-lg shadow-md border border-indigo-200 space-y-4">
                <h2 class="text-xl font-semibold text-indigo-800">Árabigo a Romano</h2>

                <input type="number" id="arabicInput" placeholder="Introduce un número (1-3999)" 
                    class="w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150">

                <button id="convertArabic" class="w-full bg-indigo-600 text-white font-medium p-3 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center">
                    <span id="arabicBtnText">Convertir a Romano</span>
                    <div id="arabicSpinner" class="spinner ml-2"></div>
                </button>

                <div id="romanResult" class="p-3 bg-white border border-gray-300 rounded-lg text-center text-gray-800 font-mono text-lg min-h-[44px] flex items-center justify-center">
                </div>
            </div>

            <div class="bg-teal-50 p-6 rounded-lg shadow-md border border-teal-200 space-y-4">
                <h2 class="text-xl font-semibold text-teal-800">Romano a Árabigo</h2>

                <input type="text" id="romanInput" placeholder="Introduce un número romano (ej: MCMXCIV)" 
                    class="w-full p-3 border border-teal-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150 uppercase">

                <button id="convertRoman" class="w-full bg-teal-600 text-white font-medium p-3 rounded-lg hover:bg-teal-700 transition duration-200 flex items-center justify-center">
                    <span id="romanBtnText">Convertir a Árabigo</span>
                    <div id="romanSpinner" class="spinner ml-2"></div>
                </button>

                <div id="arabicResult" class="p-3 bg-white border border-gray-300 rounded-lg text-center text-gray-800 font-mono text-lg min-h-[44px] flex items-center justify-center">
                </div>
            </div>
        </div>
    </div>

    <script>
        // Función genérica para manejar las llamadas a la API
        async function handleConversion(inputElementId, resultElementId, endpoint, isArabicToRoman) {
            const inputElement = document.getElementById(inputElementId);
            const resultElement = document.getElementById(resultElementId);
            const buttonId = isArabicToRoman ? 'convertArabic' : 'convertRoman';
            const button = document.getElementById(buttonId);
            const spinner = button.querySelector('.spinner');
            const buttonText = button.querySelector('span');

            const value = inputElement.value.trim();
            if (!value) {
                resultElement.innerHTML = '<span class="text-red-500">Debes ingresar un valor.</span>';
                resultElement.classList.remove('text-green-600');
                return;
            }

            // Mostrar estado de carga
            button.classList.add('loading');
            button.disabled = true;

            // Construir el parámetro de query
            const paramName = isArabicToRoman ? 'arabic' : 'roman';
            const url = \`${window.location.origin}\${endpoint}?\${paramName}=\${encodeURIComponent(value)}\`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (response.status === 200) {
                    // Éxito: Mostrar el resultado
                    const resultKey = isArabicToRoman ? 'roman' : 'arabic';
                    resultElement.textContent = data[resultKey];
                    resultElement.classList.remove('text-red-500', 'text-gray-800');
                    resultElement.classList.add('text-green-600');
                } else {
                    // Error: Mostrar el mensaje de error de la API (400)
                    resultElement.innerHTML = \`<span class="text-red-500">\${data.error || 'Error desconocido'}</span>\`;
                    resultElement.classList.remove('text-green-600', 'text-gray-800');
                }
            } catch (error) {
                console.error('Error de conversión:', error);
                // Error de conexión
                resultElement.innerHTML = '<span class="text-red-500">Error de conexión con el servidor.</span>';
                resultElement.classList.remove('text-green-600', 'text-gray-800');
            } finally {
                // Ocultar estado de carga
                button.classList.remove('loading');
                button.disabled = false;
            }
        }

        // Event Listeners
        document.getElementById('convertArabic').addEventListener('click', () => {
            handleConversion('arabicInput', 'romanResult', '/a2r', true);
        });

        document.getElementById('convertRoman').addEventListener('click', () => {
            handleConversion('romanInput', 'arabicResult', '/r2a', false);
        });

        // Opcional: Ejecutar conversión al presionar Enter
        document.getElementById('arabicInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') document.getElementById('convertArabic').click();
        });
        document.getElementById('romanInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') document.getElementById('convertRoman').click();
        });

    </script>
</body>
</html>
    `);
});

// Endpoint para Arábigo a Romano
app.get('/a2r', (req, res) => {
    // La conversión se realiza con un entero. Si 'arabic' no está o es inválido (ej: 'xyz'), parseInt dará NaN.
    // arabicToRoman ahora maneja el error de NaN.
    const arabic = parseInt(req.query.arabic, 10);

    try {
        const roman = arabicToRoman(arabic);
        res.status(200).json({ roman: roman });
    } catch (e) {
        // Captura y responde con el mensaje de error de converter.js y estado 400.
        res.status(400).json({ error: e.message });
    }
});

// Endpoint para Romano a Árabigo
app.get('/r2a', (req, res) => {
    // roman será un string vacío si el parámetro está ausente, lo cual es manejado por romanToArabic.
    const roman = req.query.roman ? req.query.roman.toUpperCase() : '';

    try {
        const arabic = romanToArabic(roman);
        res.status(200).json({ arabic: arabic });
    } catch (e) {
        // Captura y responde con el mensaje de error de converter.js y estado 400.
        res.status(400).json({ error: e.message });
    }
});


// Estructura Vercel-Compatible: Exportar la instancia de la aplicación
/* istanbul ignore next */
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running locally on http://localhost:${PORT}`);
    });
}

module.exports = app;
