// converter.js

/**
 * Convierte un número arábigo a romano.
 * @param {number} num - El número arábigo (1-3999).
 * @returns {string} El número romano.
 * @throws {Error} Si el número está fuera del rango permitido.
 */
function arabicToRoman(num) {
    // ⚠️ Importante: Este mensaje de error debe coincidir con el test.
    if (num < 1 || num > 3999 || !Number.isInteger(num)) {
        throw new Error("El número debe ser un entero entre 1 y 3999.");
    }

    const map = [
        { value: 1000, symbol: "M" },
        { value: 900, symbol: "CM" },
        { value: 500, symbol: "D" },
        { value: 400, symbol: "CD" },
        { value: 100, symbol: "C" },
        { value: 90, symbol: "XC" },
        { value: 50, symbol: "L" },
        { value: 40, symbol: "XL" },
        { value: 10, symbol: "X" },
        { value: 9, symbol: "IX" },
        { value: 5, symbol: "V" },
        { value: 4, symbol: "IV" },
        { value: 1, symbol: "I" },
    ];

    let result = '';
    let i = 0;
    let currentNum = num;

    while (currentNum > 0) {
        if (currentNum >= map[i].value) {
            result += map[i].symbol;
            currentNum -= map[i].value;
        } else {
            i++;
        }
    }
    return result;
}

/**
 * Convierte un número romano a arábigo.
 * @param {string} roman - El número romano.
 * @returns {number} El número arábigo.
 * @throws {Error} Si el formato del número romano es inválido.
 */
function romanToArabic(roman) {
    const map = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    };
    
    // ⚠️ Importante: Este mensaje de error debe coincidir con el test.
    const invalidRomanError = "El formato del número romano es inválido o excede el rango.";

    let result = 0;
    
    // Simple validación de caracteres
    if (!/^[IVXLCDM]+$/i.test(roman)) {
        throw new Error(invalidRomanError);
    }

    for (let i = 0; i < roman.length; i++) {
        const current = map[roman[i]];
        const next = map[roman[i + 1]];

        if (next > current) {
            result += next - current;
            i++; // Saltar el siguiente carácter ya que se usó en la resta
        } else {
            result += current;
        }
    }

    // Comprobación de validez (verifica que el romano generado a partir del resultado
    // coincida con la entrada original para evitar casos como 'IIII' o 'IL').
    try {
        if (arabicToRoman(result) !== roman || result > 3999 || result < 1) {
             throw new Error(invalidRomanError);
        }
    } catch (e) {
        // Capturamos el error de rango lanzado por arabicToRoman si es necesario.
        throw new Error(invalidRomanError);
    }

    return result;
}

module.exports = {
    arabicToRoman,
    romanToArabic
};