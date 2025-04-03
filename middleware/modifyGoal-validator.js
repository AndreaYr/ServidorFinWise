import { check, validationResult} from "express-validator";

const validatorParams = [
    check('meta_id')
        .isUUID()
        .isInt()
        .notEmpty(),
    check('usuario_id')
        .isUUID()
        .isInt()
        .notEmpty,
    check('nombre')
        .optional()
        .isString()
        .isLength({min: 3, max: 200}),
    check('monto_objetivo')
        .isDecimal()
        .notEmpty()
        .custom((value) => {
            if(parseFloat(value) <= 0){
                console.log('El monto objetivo debe ser mayor a cero');
            }
            return true;
        }),
    check('fecha_limite')
        .isISO8601()
        .custom((value) => {
            if(new Date(value) < new Date()){
                throw new Error('La fecha limite debe ser mayor a la fecha actual');
            }
            return true;
        }),
    check('estado')
        .isIn(['pendiente', 'en progreso', 'completado'])
        .notEmpty(),
];

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export default {validatorParams, validator};