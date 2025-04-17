import {check, validatorResult} from "express-validator";

const validatorParams =[
    check('usuario_id')
        .notEmpty()
        .isInt({min: 1}),
    check('nombre')
        .notEmpty()
        .isString()
        .isLength({min: 3, max: 50}),
    check('tipo_gasto')
    
       
];

