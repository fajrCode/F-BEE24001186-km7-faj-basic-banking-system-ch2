import ResponseHandler from "../utils/response.js";
import { getIoInstance } from '../configs/websocket.js'; 

const response = new ResponseHandler();

export class IndexCtrl {
    root = (req, res) => {
        const io = getIoInstance();
        io.emit('notification', { message: 'New notification from server!' });

        return response.res200('Binar x Fajri API v1 Ready to use (❁´◡`❁) Happy Coding!', null, res)
    }

    notification = (req, res) => {
        res.render('notification.ejs');
    }

}