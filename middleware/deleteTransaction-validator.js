import { check, validationResult } from "express-validator";

const validatorParams = [
    check('usuario_id')
        .notEmpty().withMessage('El id del usuario es obligatorio')
        .isInt().withMessage('El id del usuario debe ser un número entero'),
    check('transactionId')
        .notEmpty()
        .isInt(),
];

function validator(req, res, next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export default {validatorParams, validator};