import { check, validationResult } from 'express-validator';
import MetaAhorro from '../dto/metas_ahorro.js';

const validatorParams = [
    check('meta_id') // Cambiado de 'goalId' a 'meta_id'
        .notEmpty()
        .isInt({ min: 1 })
        .custom(async (value, { req }) => {
            console.log('Validando meta_id:', value, 'usuario_id:', req.body.usuario_id); // Registro de depuración
            const meta = await MetaAhorro.findOne({ where: { meta_id: value, usuario_id: req.body.usuario_id } });
            if (!meta) {
                console.error('Meta no encontrada o no pertenece al usuario:', value); // Registro de depuración
                throw new Error('La meta no existe o no pertenece al usuario');
            }
        }),

    check('usuario_id')
        .notEmpty()
        .isInt({ min: 1 }),
];

const validator = (req, res, next) => {
    console.log('Cuerpo de la solicitud en el middleware:', req.body); // Registro de depuración

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Errores de validación:', errors.array()); // Registro de depuración
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export default { validatorParams, validator };