import Categoria from "../dto/categoria.js";
import { check, validationResult } from "express-validator";

const validatorParams = [
    check('nombre')
        .notEmpty()
        .isLength({ min: 3 })
        .isString()
        .custom(async (value, { req }) => {
            const categoria = await Categoria.findOne({ where: { nombre: req.body.nombre } }); 
            if (categoria) {
                throw new Error('El nombre ya está en uso');
            }
            return true;
        }),
    check('tipo')
        .isString()
        .notEmpty()
        .isIn(['ingreso', 'gasto'])
        .custom((value) => {
            if (value !== 'ingreso' && value !== 'gasto') {
                throw new Error('El tipo debe ser "ingreso" o "gasto"');
            }
            return true;
        }),
    check('icono')
        .isString()
        .notEmpty()
        .custom((value) => {
            if (!/^fa-/.test(value)) {
                throw new Error('El icono debe comenzar con "fa-"');
            }
            return true;
        }),
    check('color')
        .isString()
        .notEmpty()
        .custom((value) => {
            if (!/^#[0-9A-F]{6}$/i.test(value)) {
                throw new Error('El color debe ser un código hexadecimal válido');
            }
            return true;
        }),
];

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Errores de validación:', errors.array()); // Log de errores de validación
        return res.status(422).json({ error: errors.array() });
    }
    next();
}

export default { validatorParams, validator };