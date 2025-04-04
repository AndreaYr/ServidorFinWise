import { check, validationResult } from "express-validator";

const validatorParams = [
    check('usuario_id')
        .notEmpty().withMessage('El id del usuario es obligatorio')
        .isInt({min: 1}),
    check('transactionId')
        .notEmpty()
        .isInt({min: 1}),
];

function validator(req, res, next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}

export default {validatorParams, validator};