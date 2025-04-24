import { check, validationResult } from 'express-validator';

const validatorParams = [
    check('email')
        .isEmail()
        .normalizeEmail()
        .notEmpty(),
    check('contrasenia')
        .notEmpty()
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        
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