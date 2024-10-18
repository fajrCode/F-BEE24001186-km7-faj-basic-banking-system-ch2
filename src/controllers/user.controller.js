import BaseCtrl from './base.controller.js';
import UserService from '../services/user.service.js';

export default class UserCtrl extends BaseCtrl {
    constructor() {
        super(new UserService());
    }

}