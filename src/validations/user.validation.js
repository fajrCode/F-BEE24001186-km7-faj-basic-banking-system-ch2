import Joi from 'joi';

const createUserValidator = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    identityType: Joi.string().valid('ktp', 'passport', 'sim').required(),
    identityNumber: Joi.string().min(16).max(16).required(),
    address: Joi.string().min(3).required(),
});

export default createUserValidator;