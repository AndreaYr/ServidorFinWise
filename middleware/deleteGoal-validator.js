import { check, validationResult } from 'express-validator';
import MetaAhorro from '../dto/metas_ahorro.js';

const validatorParams = [
    check('meta_id')
        .notEmpty().withMessage('El ID de la meta es obligatorio.')
        .isInt({ min: 1 }).withMessage('El ID de la meta debe ser un número entero mayor a 0.')
        .custom(async (value, { req }) => {
            const meta = await MetaAhorro.findOne({ where: { meta_id: value, usuario_id: req.body.usuario_id } });
            if (!meta) {
                throw new Error('La meta no existe o no pertenece al usuario.');
            }
        }),
    check('usuario_id')
        .notEmpty().withMessage('El ID del usuario es obligatorio.')
        .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero mayor a 0.')
];

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export default { validatorParams, validator };