import {check, validationResult} from 'express-validator';

const validatorParams = [
    check('contrasenia')
        .isString()
        .isLength({min: 6})
        .notEmpty()
        .matches(/\d/).withMessage('Debe contener al menos un número')
        .matches(/[A-Z]/).withMessage('Debe contener al menos una letra mayúscula'),
    check('token')
        .notEmpty()
        .isLength({min: 32})
];

function validator(req, res, next) {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({error: error.array()});
    }
    next();
}

export default {validatorParams, validator};