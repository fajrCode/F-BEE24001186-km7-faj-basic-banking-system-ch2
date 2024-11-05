import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Auth } from "../auth.js";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
    let auth;
    let req;
    let res;
    let next;

    beforeEach(() => {
        auth = new Auth();
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe("authenticate", () => {
        it("should return 401 if no authorization header", () => {
            auth.authenticate(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it("should return 401 if token is invalid", () => {
            req.headers.authorization = "Bearer invalidToken";
            auth.authenticate(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it("should set user in request object if token is valid barier token", () => {
            req.headers.authorization = "Bearer validToken";
            jwt.verify = jest.fn().mockReturnValue({ id: 1, name: "test" });
            auth.authenticate(req, res, next);
            expect(req.user).toEqual({ id: 1, name: "test" });
            expect(next).toHaveBeenCalled();
        });

        it("should set user in request object if token is valid with standar token", () => {
            req.headers.authorization = "validToken";
            jwt.verify = jest.fn().mockReturnValue({ id: 1, name: "test" });
            auth.authenticate(req, res, next);
            expect(req.user).toEqual({ id: 1, name: "test" });
            expect(next).toHaveBeenCalled();
        });


    });

    describe("checkLoginAuth", () => {
        it("should return 401 if authorization header is present", () => {
            req.headers.authorization = "Bearer validToken";
            auth.checkLoginAuth(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it("should call next if no authorization header", () => {
            auth.checkLoginAuth(req, res, next);
            expect(next).toHaveBeenCalled();
        });

    });

});

