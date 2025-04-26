import { check, validationResult } from "express-validator";

const validatorParams = [
    //lo quite para que no sea obligatorio el id del usuario. poder registrar teniendo en cuenta que hay un usuario ya autenticado
    check('usuario_id')
       .notEmpty().withMessage('El id del usuario es obligatorio')
        .isInt({min: 1}),
    check('categoria_id')
        .notEmpty()
        .isInt({min: 1}),
    check('tipo')
        .notEmpty()
        .isIn(['ingreso', 'gasto']).withMessage('El tipo de transacción debe ser "ingreso" o "gasto"'),
    check('monto')
        .notEmpty()
        .isDecimal()
        .custom(value => {
            if(parseFloat(value) <= 0){
                throw new Error('El monto debe ser mayor a 0');
            }
            return true;
        }),

    check('descripcion')
        .optional()
        .isString()
        .isLength({min: 3, max: 200}),

    check('fecha')
        .notEmpty()
        .isISO8601()
];


//Middleware para manejar errores de validación
function validator(req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }
    next();
}

export default {validatorParams, validator};