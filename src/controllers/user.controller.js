import BaseCtrl from './base.controller.js';
import UserService from '../services/user.service.js';
import createUserValidator from '../validations/user.validation.js';
import { Error400 } from '../utils/custom_error.js';

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

            return this.response.res201('Create User and Profile Success', newUser, res);
        } catch (err) {
            if (err instanceof Error400) {
                return this.response.res400(err.message, res);
            } else {
                console.log(err.message);
                return this.response.res500(res);
            }
        }
    };

    // Override method update from BaseCtrl
    update = async (req, res) => {
        try {
            const { error, value } = createUserValidator.validate(req.body);
            if (error) {
                return this.response.res400(`Validation error: ${error.details[0].message}`, res);
            }

            const updatedUser = await this._service.update(req.params.id, value);

            return this.response.res201('Update User and Profile Success', updatedUser, res);
        } catch (err) {
            if (err instanceof Error400) {
                const message = err.message.split('invocation:').pop().trim();
                return this.response.res400(message, res);
            } else {
                console.log(err.message);
                return this.response.res500(res);   
            }
        }
    };

}