import BaseCtrl from './base.controller.js';
import TransactionService from '../services/transaction.service.js';
import createTransactionValidator from '../validations/transaction.validation.js';
import { Error400, Error404 } from '../utils/custom_error.js';

export default class TransactionCtrl extends BaseCtrl {
    constructor() {
        super(new TransactionService());
    }

    // Override method create from BaseCtrl
    create = async (req, res) => {
        try {
            // Validation input
            const { error, value } = createTransactionValidator.validate(req.body);
            if (error) {
                return this.response.res400(`Validation error: ${error.details[0].message}`, res);
            }

            const newTransaction = await this._service.create(value);

            return this.response.res200('Create Transaction Success', newTransaction, res);
        } catch (err) {
            if (err instanceof Error400) {
                return this.response.res400(err.message, res);
            } else if (err instanceof Error404) {
                return this.response.res404(err.message, res);
            } else {
                console.error(err.message);
                return this.response.res500(res);   
            }
        }
    };

}