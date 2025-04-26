import { check, validationResult } from 'express-validator';

const validatorParams = [
    check('usuario_id')
        .notEmpty().withMessage('El ID del usuario es obligatorio.')
        .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero mayor a 0.'),
    check('monto_objetivo')
        .notEmpty().withMessage('El monto objetivo es obligatorio.')
        .isDecimal().withMessage('El monto objetivo debe ser un número decimal.')
        .custom(value => {
            if (parseFloat(value) <= 0) {
                throw new Error('El monto objetivo debe ser mayor a 0.');
            }
            return true;
        }),
    check('fecha_limite')
        .notEmpty().withMessage('La fecha límite es obligatoria.')
        .isISO8601().withMessage('La fecha límite debe tener un formato válido.'),
    check('estado')
        .notEmpty().withMessage('El estado es obligatorio.')
        .isIn(['pendiente', 'en progreso', 'completado']).withMessage('El estado debe ser "pendiente", "en progreso" o "completado".')
];

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export default { validatorParams, validator };
