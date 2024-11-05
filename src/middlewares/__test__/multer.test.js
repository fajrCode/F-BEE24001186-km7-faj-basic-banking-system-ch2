import { uploadImage, handleUploadError } from "../multer.js";
import { jest, describe, beforeEach, afterEach, it, expect } from "@jest/globals";
import multer from "multer";
import { Error400 } from "../../utils/custom_error.js";

jest.mock("multer");

describe("Multer Middleware", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {};
        res = {};
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