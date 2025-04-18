import {check, validationResult} from "express-validator";

const validatorParams =[
    check('usuario_id')
        .notEmpty()
        .isInt({min: 1}),
    check('nombre')
        .notEmpty()
        .isString()
        .isLength({min: 3, max: 50}),
    check('tipo_gasto')
        .notEmpty()
        .isString()
        .isIn(['fijo', 'variable'])
        .custom((value) => {
            if (value !== 'fijo' && value !== 'variable') {
                throw new Error('El tipo de gasto debe ser "fijo" o "variable"');
            }
            return true;
        }),
    check('descripcion')
        .optional()
        .isString()
        .isLength({max: 255}),
    check('icono')
        .optional(),
    check('monto_previsto')
        .notEmpty()
        .isFloat({min: 0.01, max: 99999999})
        .isNumeric()
        .custom((value) => {
            if (value <= 0) {
                throw new Error('El monto previsto debe ser mayor que cero');
            }
            return true;
        }),
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