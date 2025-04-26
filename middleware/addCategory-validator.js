import { body, validationResult } from 'express-validator';

const validatorParams = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre de la categoría es obligatorio.')
    .isString()
    .withMessage('El nombre debe ser un texto.'),
  body('tipo')
    .notEmpty()
    .withMessage('El tipo de la categoría es obligatorio.')
    .isIn(['ingreso', 'gasto'])
    .withMessage('El tipo debe ser "ingreso" o "gasto".'),
  body('icono')
    .optional()
    .isString()
    .withMessage('El icono debe ser un texto.'),
  body('color')
    .optional()
    .isString()
    .withMessage('El color debe ser un texto.'),
];

const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default { validatorParams, validator };