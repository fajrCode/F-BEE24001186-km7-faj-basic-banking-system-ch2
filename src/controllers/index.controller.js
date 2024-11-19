import ResponseHandler from "../utils/response.js";
import { getIoInstance } from '../configs/websocket.js'; 

const response = new ResponseHandler();

export class IndexCtrl {
    root = (req, res) => {
        const io = getIoInstance();
        io.emit('notif-success', { message: 'Success from server!' });
        io.emit('welcome-message', { message: 'You have new notification bro' });
        return response.res200('Binar x Fajri API v1 Ready to use (❁´◡`❁) Happy Coding!', null, res)
    }

    welcome = (req, res) => {
        const io = getIoInstance();
        setTimeout(() => {
            io.emit('welcome-message', { message: 'WELCOME BRODIE 🤩' });
        }, 1000);
        res.render('welcome.ejs', { msg: 'Welcome Brodie' });
    }

    notification = (req, res) => {
        res.render('notification.ejs');
    }

}