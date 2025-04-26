import { check, validationResult } from "express-validator";

const validatorParams = [
    check('usuario_id')
        .notEmpty().withMessage('El ID del usuario es obligatorio.')
        .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero mayor a 0.'),
    check('nombre')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isString().withMessage('El nombre debe ser un texto.')
        .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres.'),
    check('tipo_gasto')
        .notEmpty().withMessage('El tipo de gasto es obligatorio.')
        .isIn(['fijo', 'variable']).withMessage('El tipo de gasto debe ser "fijo" o "variable".'),
    check('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser un texto.')
        .isLength({ max: 255 }).withMessage('La descripción debe tener como máximo 255 caracteres.'),
    check('monto_previsto')
        .notEmpty().withMessage('El monto previsto es obligatorio.')
        .isFloat({ min: 0.01 }).withMessage('El monto previsto debe ser mayor que 0.')
];

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

export default { validatorParams, validator };