import BaseCtrl from './base.controller.js';
import AccountService from '../services/account.service.js';
import createAccountValidator from '../validations/account.validation.js';
import { Error400 } from '../utils/custom_error.js';

export default class AccountCtrl extends BaseCtrl {
    constructor() {
        super(new AccountService());
    }

    // Override method create from BaseCtrl
    create = async (req, res) => {
        try {
            const { error, value } = createAccountValidator.validate(req.body); // Validation input
            if (error) {
                return this.response.res400(`Validation error: ${error.details[0].message}`, res);
            }

            const newAccount = await this._service.create(value);

            return this.response.res201('Create Bank Account Success', newAccount, res);
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