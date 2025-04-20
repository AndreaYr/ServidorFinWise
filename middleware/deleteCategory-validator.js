import { check, validationResult } from "express-validator";

const validatorParams = [
    check('id')
        .isInt({min: 1})
        .notEmpty(),
    check('nombre')
        .isString()
        .notEmpty()
        .isLength({ min: 3, max: 50 })
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