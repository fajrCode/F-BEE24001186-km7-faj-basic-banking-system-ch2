// services/userService.js
import BaseService from './base.service.js';
import prisma from '../configs/database.js';

export default class UserService extends BaseService {
    constructor() {
        super(prisma.user); // Mengirim model user ke BaseService
    }
}
