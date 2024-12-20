import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../configs/database.js";
import { Error400, Error404 } from "../utils/custom_error.js";
import sendEmail from "../utils/nodemailer.js";
import { getIoInstance } from '../configs/websocket.js'; 

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
            if (err instanceof Error400) {
                throw new Error400(err.message);
            } else {
                console.log(err.message);
                throw new Error("Internal Server Error");
            }
        }
    }

    async register(data) {
        try {
            data.password = await bcrypt.hash(data.password, 10);
            const user = await this._model.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    profile: {
                        create: {
                            identityTypes: data.identityType,
                            identityNumber: String(data.identityNumber),
                            address: data.address,
                        }
                    }
                },
                include: {
                    profile: true,
                }
            });

            delete user.password;
            return user;
        } catch (err) {
            if (err.code === 'P2002') {  // Unique constraint violation
                const match = err.message.match(/\(([^)]+)\)/);
                const message = match ? `${match[1]} already exists` : 'Some field already exists';
                throw new Error400(message);
            } else {
                console.log(err.message);
                throw new Error('UnknownError');  // Fallback to generic error
            }
        }
    }

    async authenticate(id) {
        try {
            const user = await this._model.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    profile: true,
                },
            });

            if (!user) return null;

            delete user.password;
            
            return user;
        } catch {
            throw new Error404("User is not found");
        };
    };

    async forgotPassword(email) {
        const io = getIoInstance();
        try {
            const user = await this._model.findUnique({
                where: {
                    email,
                },
            });

            if (!user) {
                throw new Error400("Email is wrong");
            }

            await sendEmail(email);

            io.emit('notif-success', { message: `Success sending email reset password to ${email}` });
            io.emit('welcome-message', { message: 'You have new notification bro' });

            // send email with nodemailer
            return { message: "Email has been sent" };
        } catch (err) {
            io.emit('notif-failed', { message: `Failed sending email reset password for ${email}` });
            io.emit('welcome-message', { message: 'You have new notification bro' });
            if (err instanceof Error400) {
                throw new Error400(err.message);
            } else {
                console.log(err.message);
                throw new Error("Internal Server Error");
            }
        }
    }

    async resetPassword(data) {
        const io = getIoInstance();
        try {
            const user = await this._model.findUnique({
                where: {
                    email: data.email,
                },
            });

            if (!user) {
                throw new Error400("Email is wrong");
            }

            const password = await bcrypt.hash(data.password, 10);

            await this._model.update({
                where: {
                    id: user.id,
                },
                data: {
                    password,
                },
            });
            
            io.emit('notif-success', { message: `Success change password ${data.email}` });
            io.emit('welcome-message', { message: 'You have new notification bro' });

            return { message: "Password has been reset" };
        } catch (err) {
            io.emit('notif-failed', { message: `Failed change password ${data.email}` });
            io.emit('welcome-message', { message: 'You have new notification bro' });
            if (err instanceof Error400) {
                throw new Error400(err.message);
            } else {
                console.log(err.message);
                throw new Error("Internal Server Error");
            }
        }
    }
    
};