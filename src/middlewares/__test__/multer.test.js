// import multer from "multer";
// import path from "path";
// import { Error400 } from "../utils/custom_error.js";

// const filename = (req, file, cb) => {
//     // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     // const ext = path.extname(file.originalname);
//     // const name = path.basename(file.originalname, ext);
//     // cb(null, `${name}-${uniqueSuffix}${ext}`);

//     const filename = Date.now() + path.extname(file.originalname);
//     cb(null, filename);

// };

// const generateStorage = (destination) => {
//     return multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, destination);
//         },
//         filename,
//     });
// };

// export const uploadImage = (destination) => {
//     return multer({
//         // storage: generateStorage(destination), // for local storage
//         fileFilter: (req, file, cb) => {
//             const allowedMimesTypes = ["image/jpeg", "image/png", "image/png"];
//             if (allowedMimesTypes.includes(file.mimetype)) {
//                 cb(null, true);
//             } else {
//                 const err = new Error400(`Only ${allowedMimesTypes.join(", ")} are allowed to upload`);
//                 cb(err, false);
//             }
//         },
//         limits: {
//             fileSize: 1024 * 1024 * 2, // 2MB
//         },
//     });
// };

// export const handleUploadError = (err, req, res, next) => {
//     if (err instanceof multer.MulterError) {
//         if (err.code === 'LIMIT_FILE_SIZE') {
//             return next(new Error400('File size is too large. Maximum size is 2MB.'));
//         }
//     } else if (err) {
//         return next(err);
//     }
//     next();
// };

// unit test for multer middleware

import { uploadImage, handleUploadError } from "../multer.js";
import multer from "multer";
import path from "path";
import { Error400 } from "../../utils/custom_error.js";

jest.mock("multer");

describe("Multer Middleware", () => {
    let req;
    let res;
    let file;
    let next;

    beforeEach(() => {
        req = {};
        res = {};
        file = { mimetype: "" };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("uploadImage", () => {
        it("should return multer object", () => {
            const destination = "public/images/profiles";
            const multerObject = uploadImage(destination);
            expect(multer).toHaveBeenCalled(multerObject);
        });

    });

    describe("handleUploadError", () => {
        it("should call next with Error400 if error is instance of MulterError and code is LIMIT_FILE_SIZE", () => {
            const err = new multer.MulterError("LIMIT_FILE_SIZE");
            err.code = "LIMIT_FILE_SIZE";
            handleUploadError(err, req, res, next);
            expect(next).toHaveBeenCalledWith(new Error400("File size is too large. Maximum size is 2MB."));
        });

        it("should call next with error if error is not instance of MulterError", () => {
            const err = new Error("error");
            handleUploadError(err, req, res, next);
            expect(next).toHaveBeenCalledWith(err);
        });

        it("should call next if no error", () => {
            handleUploadError(null, req, res, next);
            expect(next).toHaveBeenCalled();
        });

    });

});