import Goal from '../dto/metas_ahorro.js';
import {check, validationResult} from 'express-validator';

const validatorParams  = [
    check('usuario_id')
        .isInt({min: 1})
        .notEmpty(),
    check('monto_objetivo')
        .isDecimal()
        .notEmpty()
        .custom((value) => {
            if(parseFloat(value) <= 0){
                throw new Error('El monto objetivo debe ser mayor a 0');
            }
            return true;
        }),
    check('fecha_limite')
        .isISO8601()
        .notEmpty(),
    check('estado')
        .isIn(['pendiente', 'en progreso', 'completado'])
        .notEmpty()
];

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export default {validatorParams, validator};
