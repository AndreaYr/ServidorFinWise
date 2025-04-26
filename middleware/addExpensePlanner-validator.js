import { check, validationResult } from "express-validator";

const validatorParams = [
    check('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser un texto.')
        .isLength({ max: 255 }).withMessage('La descripción debe tener como máximo 255 caracteres.'),
    check('monto_previsto')
        .notEmpty().withMessage('El monto previsto es obligatorio.')
        .isFloat({ min: 0.01 }).withMessage('El monto previsto debe ser mayor que 0.'),
    check('gastos_reales')
        .notEmpty()
        .isFloat({ min: 0.01 }).withMessage('El monto previsto debe ser mayor que 0.'),
    check('diferencia')
        .notEmpty()
        .isFloat({ min: 0.01 }),
];

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

export default { validatorParams, validator };