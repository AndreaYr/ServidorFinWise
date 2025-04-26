import { body, validationResult } from 'express-validator';

const validatorParams = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre de la meta es obligatorio.')
    .isString()
    .withMessage('El nombre debe ser un texto.'),
  body('montoObjetivo')
    .notEmpty()
    .withMessage('El monto objetivo es obligatorio.')
    .isNumeric()
    .withMessage('El monto objetivo debe ser un número.'),
  body('fechaLimite')
    .notEmpty()
    .withMessage('La fecha límite es obligatoria.')
    .isISO8601()
    .withMessage('La fecha límite debe ser una fecha válida.'),
];

const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default { validatorParams, validator };
