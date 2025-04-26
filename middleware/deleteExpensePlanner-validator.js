import { check, validationResult } from "express-validator";

const validatorParams = [
    check('id')
        .notEmpty().withMessage('El ID del planificador es obligatorio.')
        .isInt({ min: 1 }).withMessage('El ID del planificador debe ser un número entero mayor a 0.')
];

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

export default { validatorParams, validator };