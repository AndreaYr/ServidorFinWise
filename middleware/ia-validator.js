import express from "express";
import {check, validationResult} from "express-validator";
import rateLimit from "express-rate-limit";
import ChatBot from "../dto/chatBot";

const router = express.Router();
const palabrasProhibidas = ["palabra1", "palabra2", "insulto"]; // Lista de palabras prohibidas

//Middleware de protección contra spam
const limitador = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 5, // Limite de 5 preguntas por minuto
    message: "Has superado el limite de solicitudes. Intenta más tarde.",
});

const validatorParams = [
    check('usuario_id') // Asegúrate de que este campo es obligatorio
        .isInt({ min: 1 })
        .notEmpty(),
    check('descripcion')
        .trim()
        .optional()
        .notEmpty()
        .isString()
        .isLength({min: 5, max: 200}),
    check('estado')
        .isString()
        .isIn(['pendiente', 'en progreso', 'completado'])
        .notEmpty(),
];

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export default {validatorParams, validator};