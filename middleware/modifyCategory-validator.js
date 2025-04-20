import Categoria  from "../dto/categoria.js"; 
import { check, validationResult } from "express-validator";

const validatorParams = [
    check('id')
        .isInt({min: 1})
        .notEmpty(),
    check('nombre')
        .optional() 
        .isString()
        .isLength({ min: 3, max: 50 })
        .custom(async (value, { req }) => {
            const categoria = await Categoria.findOne({ where: { nombre: req.body.nombre } }); // Verifica si la categoría ya existe en la base de datos
            if (categoria) {
                throw new Error('El nombre de la categoría ya está en uso');
            }
            return true;
        }),
    check('tipo')
        .optional() 
        .isString()
        .isLength({ min: 3, max: 50 })
        .isIn(['ingreso', 'gasto'])
        .custom((value) => {
            if (value && !['ingreso', 'gasto'].includes(value)) {
                throw new Error('El tipo debe ser "ingreso" o "gasto"');
            }
            return true;
        })
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