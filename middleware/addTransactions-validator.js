import { body, validationResult } from 'express-validator';

const validatorParams = [
  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es obligatoria.')
    .isString()
    .withMessage('La descripción debe ser un texto.'),
  body('monto')
    .notEmpty()
    .withMessage('El monto es obligatorio.')
    .isNumeric()
    .withMessage('El monto debe ser un número.'),
  body('categoria_id')
    .notEmpty()
    .withMessage('La categoría es obligatoria.')
    .isInt()
    .withMessage('La categoría debe ser un número entero.'),
  body('tipo')
    .notEmpty()
    .withMessage('El tipo es obligatorio.')
    .isIn(['ingreso', 'gasto'])
    .withMessage('El tipo debe ser "ingreso" o "gasto".'),
];

const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default { validatorParams, validator };