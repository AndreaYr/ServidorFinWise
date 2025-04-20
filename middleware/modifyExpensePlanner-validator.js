import Planificador from "../dto/planificador.js"; // Asegúrate de que la ruta sea correcta
import { check, validationResult } from "express-validator";
import { Op } from "sequelize"; // Importa Op desde Sequelize

const validatorParams = [
    check('id')
        .notEmpty().withMessage('El ID del planificador es requerido para modificarlo.')
        .isInt({ min: 1 }),
    check('nombre')
        .optional()
        .isString()
        .isLength({ min: 3, max: 50 })
        .custom(async (value, { req }) => {
            const planificador = await Planificador.findOne({ where: { nombre: req.body.nombre } }); // Excluye el planificador actual
            if (planificador) {
                throw new Error('El nombre del planificador ya está en uso');
            }
            return true;
        }),
    check('tipo_gasto')
        .optional()
        .isString()
        .isLength({ min: 3, max: 50 }),
    check('descripcion')
        .optional()
        .isString()
        .isLength({ min: 3, max: 255 }),
    check('icono')
        .optional(),
    check('monto_previsto')
        .notEmpty()
        .withMessage('El monto previsto es obligatorio.')
        .isFloat({ min: 0 })
        .withMessage('El monto previsto debe ser un número positivo.')
        .custom(async (value, { req }) => {
            const planificador = await Planificador.findOne({ where: { id: req.body.id } }); // Busca el planificador actual usando el ID
            if (parseFloat(value) < parseFloat(planificador.monto_previsto)) {
                throw new Error('El monto previsto no puede ser inferior al monto actual');
            }
            return true;
        })
];

function validator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Errores de validación:', errors.array()); // Log de errores de validación
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

export default { validatorParams, validator };