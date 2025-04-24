import { check, validationResult } from 'express-validator';

const validatorParams = [
    check('meta_id')
        .isInt({ min: 1 })
        .notEmpty(),
    check('monto_actual')
        .isDecimal()
        .notEmpty()
        .custom((value) => {
            if (parseFloat(value) < 0) {
                throw new Error('El monto actual debe ser mayor o igual a 0');
            }
            return true;
        })
];

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export default { validatorParams, validator };