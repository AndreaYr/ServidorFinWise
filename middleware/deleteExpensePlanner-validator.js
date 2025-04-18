import { check, validationResult } from "express-validator";

const validatorParams = [
    check('id')
        .notEmpty()
        .isInt({ min: 1 }),
    check('usuario_id')
        .notEmpty()
        .isInt({ min: 1 }),
    check('nombre')
        .notEmpty()
        .isString()
        .isLength({ min: 3, max: 50 }),
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