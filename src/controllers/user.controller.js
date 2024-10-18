import BaseCtrl from './base.controller.js';
import UserService from '../services/user.service.js';
import createUserValidator from '../validations/user.validation.js';
import { ErrorDbInput } from '../utils/custom_error.js';

export default class UserCtrl extends BaseCtrl {
    constructor() {
        super(new UserService());
    }

    // Override method create from BaseCtrl
    create = async (req, res) => {
        try {
            // Validation input
            const { error, value } = createUserValidator.validate(req.body);
            if (error) {
                return this.response.res400(`Validation error: ${error.details[0].message}`, res);
            }

            const newUser = await this._service.create(value);

            return this.response.res200('Create User and Profile Success', newUser, res);
        } catch (err) {
            console.error(err.message);
            if (err instanceof ErrorDbInput) {
                const message = err.message.split('invocation:').pop().trim();
                return this.response.res400(message, res);
            } else {
                return this.response.res500(res);   
            }
        }
    };

}