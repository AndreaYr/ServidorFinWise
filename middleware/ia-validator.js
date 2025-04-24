import {check, validationResult} from "express-validator";
/*/import rateLimit from "express-rate-limit";
//import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const validatorParams = [
    check('usuario_id') // Asegúrate de que este campo es obligatorio
        .isInt({ min: 1 })
        .notEmpty(),
    check('descripcion')
        .trim()
        .optional()
        .isString()
        .isLength({min: 5, max: 500}),
    check('estado')
        .isString()
        .isIn(['pendiente', 'en progreso', 'completado'])
        .notEmpty(),
];
/*
//Middleware de protección contra spam
const limitador = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 5, // Limite de 5 preguntas por minuto
    message: "Has superado el limite de solicitudes. Intenta más tarde.",
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Validación específica para el chatbot
const chatbotValidator = async (req, res, next) => {
    const { descripcion } = req.body;

    // Verificar si la clave de la API está configurada
    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
            error: "La clave de la API de OpenAI no está configurada. Contacta al administrador."
        });
    }

    // Verificar longitud del mensaje
    if (!descripcion || descripcion.length < 5 || descripcion.length > 500) {
        return res.status(400).json({
            error: "El mensaje debe tener entre 5 y 500 caracteres."
        });
    }

    try {
        // Llamar a la API de OpenAI para analizar el mensaje
        const response = await openai.createCompletion({
            model: "text-davinci-003", // Modelo de OpenAI
            prompt: `Analiza el siguiente texto y determina si contiene contenido ofensivo o inapropiado: "${descripcion}". Responde con "true" si es ofensivo, de lo contrario "false".`,
            max_tokens: 10,
        });

        const result = response.data.choices[0].text.trim();

       // Si el resultado es "true", bloquear el mensaje
       if (result.toLowerCase() === "true") {
        return res.status(400).json({
            error: "El mensaje contiene contenido ofensivo o inapropiado."
        });
    }
        next();
    } catch (error) {
        console.error("Error al analizar el mensaje con OpenAI:", error.message);
        return res.status(500).json({
            error: "Error interno del servidor al analizar el mensaje."
        });
    }
};

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export default {validatorParams, validator};*/