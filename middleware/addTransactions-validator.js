import { check, validationResult } from "express-validator";

const validatorParams = [
    check('categoria_id')
        .notEmpty().withMessage('El ID de la categoría es obligatorio.')
        .isInt({ min: 1 }).withMessage('El ID de la categoría debe ser un número entero mayor a 0.'),
    check('tipo')
        .notEmpty().withMessage('El tipo de transacción es obligatorio.')
        .isIn(['ingreso', 'gasto']).withMessage('El tipo de transacción debe ser "ingreso" o "gasto".'),
    check('monto')
        .notEmpty().withMessage('El monto es obligatorio.')
        .isDecimal().withMessage('El monto debe ser un número decimal.')
        .custom(value => {
            if (parseFloat(value) <= 0) {
                throw new Error('El monto debe ser mayor a 0.');
            }
            return true;
        }),
    check('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser un texto.')
        .isLength({ min: 3, max: 200 }).withMessage('La descripción debe tener entre 3 y 200 caracteres.'),
    check('fecha')
        .notEmpty().withMessage('La fecha es obligatoria.')
        .isISO8601().withMessage('La fecha debe tener un formato válido.')
];

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export default { validatorParams, validator };