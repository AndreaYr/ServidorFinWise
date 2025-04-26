import { check, validationResult } from "express-validator";

const validatorParams = [
    check('nombre')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isString().withMessage('El nombre debe ser un texto.')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),
    check('tipo')
        .notEmpty().withMessage('El tipo es obligatorio.')
        .isIn(['ingreso', 'gasto']).withMessage('El tipo debe ser "ingreso" o "gasto".'),
    check('icono')
        .notEmpty().withMessage('El icono es obligatorio.')
        .isString().withMessage('El icono debe ser un texto.')
        .custom(value => {
            if (!/^fa-/.test(value)) {
                throw new Error('El icono debe comenzar con "fa-".');
            }
            return true;
        }),
    check('color')
        .notEmpty().withMessage('El color es obligatorio.')
        .isString().withMessage('El color debe ser un texto.')
        .custom(value => {
            if (!/^#[0-9A-F]{6}$/i.test(value)) {
                throw new Error('El color debe ser un código hexadecimal válido.');
            }
            return true;
        })
];

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

export default { validatorParams, validator };