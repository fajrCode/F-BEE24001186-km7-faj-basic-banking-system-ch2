class ResponseHandler {
    resCustom(code, message, data, res) {
        res.status(code).json({
            status: {
                code,
                message,
            },
            data,
        });
    }

    res200(message, data, res) {
        res.status(200).json({
            status: {
                code: 200,
                message,
            },
            data,
        });
    }

    res201(message, data, res) {
        res.status(201).json({
            status: {
                code: 201,
                message,
            },
            data,
        });
    }

    res400(msg, res) {
        res.status(400).json({
            status: {
                code: 400,
                message: "Bad Request! - " + msg,
            },
            data: null,
        });
    }

    res401(res) {
        res.status(401).json({
            status: {
                code: 401,
                message: "Unauthorized Access!",
            },
            data: null,
        });
    }

    res403(msg, res) {
        res.status(403).json({
            status: {
                code: 403,
                message: "Forbidden - " + msg,
            },
            data: null,
        });
    }

    res404(res) {
        res.status(404).json({
            status: {
                code: 404,
                message: "URL not found!",
            },
            data: null,
        });
    }

    res405(res) {
        res.status(405).json({
            status: {
                code: 405,
                message: "Request method not allowed!",
            },
            data: null,
        });
    }

    res500(res) {
        res.status(500).json({
            status: {
                code: 500,
                message: "Server error!",
            },
            data: null,
        });
    }
}

export default ResponseHandler;