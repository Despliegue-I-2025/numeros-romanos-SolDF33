🔢 Conversor Bidireccional de Números Romanos (API REST)

Este proyecto implementa una API RESTful robusta, construida en Node.js y Express, que maneja la conversión de números entre los sistemas Arábigo y Romano.

Todo el código de la lógica de conversión está encapsulado en un módulo independiente (converter.js) y está cubierto al 100% por pruebas unitarias utilizando la librería Jest.

🔗 Despliegue en Vivo (Vercel)

La aplicación final se ha desplegado correctamente como una Función Serverless en Vercel.

🌐 URL del Servicio (API en Producción)

https://ar-bicos-romanos-tpdespliegue-saeh-git-master-soldf33s-projects.vercel.app/

🎯 Endpoints de la API

La API expone dos endpoints principales para la conversión bidireccional:

Conversión

Método

Endpoint de Ejemplo

Parámetro

Resultado Esperado

Arábigo → Romano

GET

/api/toRoman

?arabic=1984

{"roman": "MCMLXXXIV"}

Romano → Arábigo

GET

/api/toArabic

?roman=MCMLXXXIV

{"arabic": 1984}

🛠️ Ejecución Local y Tests

Para revisar el código, ejecutar la API o correr los tests de forma local:

Instalar dependencias:

npm install


Correr Tests de Unidad (Jest):

npm test


Iniciar el Servidor Local:

npm start


<<<<<<< HEAD
La API estará disponible en http://localhost:3000.
=======
La API estará disponible en http://localhost:3000.
>>>>>>> 7ba735987b84c14949b6f1f3ef734633182b3197
