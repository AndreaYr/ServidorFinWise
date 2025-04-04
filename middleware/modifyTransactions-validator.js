import { check, validationResult } from "express-validator";
    const validatorParams = [
        check('usuario_id')
            .notEmpty().withMessage('El id del usuario es obligatorio')
            .isInt({min: 1}),
        check('transactionId')
            .notEmpty()
            .isInt({min: 1}),
        check('categoria_id')
            .notEmpty()
            .isInt({min: 1}),
        check('tipo')
            .optional()
            .isIn(['ingreso', 'gasto']).withMessage('El tipo de transacción debe ser "ingreso" o "gasto"')
            .custom(value => {
                if(parseFloat(value) <= 0) {
                    throw new Error('El monto debe ser mayor a 0');
                }
                return true;
            }),
        check('descripcion')
            .optional()
            .isString()
            .isLength({ max: 50 }).withMessage('La descripción debe tener como máximo 50 caracteres'),
        check('fecha')
            .optional()
            .isISO8601(),
    ];

    function validator(req, res, next){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }

export default {validatorParams, validator};