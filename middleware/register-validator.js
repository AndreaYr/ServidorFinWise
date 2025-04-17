import {check, validationResult} from 'express-validator';

const validatorParams = [
    check('cedula')
        .isLength({min: 8, max: 10}).withMessage('Cédula debe tener 8 o 10 dígitos')
        .isNumeric().withMessage('La cédula solo debe contener números')
        .notEmpty(),
    check('nombre')
        .isString({min: 3, max: 200})
        .notEmpty(),
    check('apellidos')
        .isString({min: 3, max: 200})
        .notEmpty(),
    check('email')
        .isEmail()
        .normalizeEmail()
        .notEmpty(),
    check('contrasenia')
        .isLength({min: 6}).withMessage('La contraseña debe contener al menos 6 caracteres')
        .notEmpty()
        .matches(/\d/).withMessage('Debe contener al menos un número')
        .matches(/[A-Z]/).withMessage('Debe contener al menos una letra mayúscula')
];

//Valida si hay errores
function validator(req, res, next) {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({error: error.array()});
    }
    next();
}

export default {validatorParams, validator};