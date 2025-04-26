import { check, validationResult } from "express-validator";

const validatorParams = [
    check('usuario_id')
        .notEmpty().withMessage('El ID del usuario es obligatorio.')
        .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero mayor a 0.'),
    check('transactionId')
        .notEmpty().withMessage('El ID de la transacción es obligatorio.')
        .isInt({ min: 1 }).withMessage('El ID de la transacción debe ser un número entero mayor a 0.')
];

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export default { validatorParams, validator };