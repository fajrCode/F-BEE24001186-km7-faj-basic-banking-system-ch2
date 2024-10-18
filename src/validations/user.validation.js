import Joi from 'joi';

const createUserValidator = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    identity_type: Joi.string().valid('ktp', 'passport', 'sim').required(),
    identity_number: Joi.number().required(),
    address: Joi.string().min(3).required(),
});

export default createUserValidator;