import {check, validationResult} from 'express-validator';

const validatorParams = [
    check('email')
        .isEmail()
        .notEmpty(),
    check('contrasenia')
        .isLength({min: 6, max: 15}).withMessage('La contraseña debe contener al menos 6 caracteres')
        .notEmpty()
];

function validator(req, res, next){
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({error: error.array()});
    }
    next();
}

export default {validatorParams, validator};