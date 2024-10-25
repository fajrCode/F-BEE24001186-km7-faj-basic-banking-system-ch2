import prisma from "../configs/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 

export default class AuthService {
    constructor() {
        this._model = prisma.user;
        this.login = this.login.bind(this);
    }

    async login(data) {
        const user = await this._model.findUnique({
            where: {
                email: data.email,
            },
        });

        if (!user) {
            throw new Error("Email or password is wrong");
        }

        const isPasswordMatch = await bcrypt.compare(data.password, user.password);

        if (!isPasswordMatch) {
            throw new Error("Email or password is wrong");
        }

        const secretKey = process.env.JWT_SECRET || "secret";
        console.log(secretKey);
        const token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: "1h",
        });

        const result = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        }

        return result;
    }
}