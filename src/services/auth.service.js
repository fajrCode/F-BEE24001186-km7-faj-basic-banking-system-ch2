import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../configs/database.js";
import UserService from "./user.service.js";
import { Error400 } from "../utils/custom_error.js";

export default class AuthService {
    constructor() {
        this._model = prisma.user;
        this.login = this.login.bind(this);
    }

    async login(data) {
        try {
            const user = await this._model.findUnique({
                where: {
                    email: data.email,
                },
            });
    
            if (!user) {
                throw new Error400("Email is wrong");
            }
    
            const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    
            if (!isPasswordMatch) {
                throw new Error400("Password is wrong");
            }
    
            const secretKey = process.env.JWT_SECRET || "secret";
            const token = jwt.sign({ id: user.id, name: user.name }, secretKey, {
                expiresIn: "1h",
            });
    
            return { token };
        } catch (err) {
            if(err instanceof Error400) {
                throw new Error400(err.message);
            } else {
                console.log(err.message);
                throw new Error("Internal Server Error");
            }
        }
    }

    async register(data) {
        try {
            const userService = new UserService();
            const user = await userService.create(data);
            return user;
        } catch (err) {
            if(err instanceof Error400) {
                throw new Error400(err.message);
            } else {
                console.log(err.message);
                throw new Error("Internal Server Error");
            }
        }
    }
}