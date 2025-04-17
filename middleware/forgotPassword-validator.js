import {check, validationResult} from 'express-validator';

const validatorParams = [
    check('email')
        .exists()
        .isEmail()
        .notEmpty()
        .normalizeEmail()
];

function validator(req, res, next) {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({error: error.array()});
    }
    next();
}

export default {validatorParams, validator};