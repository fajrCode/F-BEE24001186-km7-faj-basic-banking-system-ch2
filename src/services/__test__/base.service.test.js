import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import BaseService from "../base.service.js";
import prisma from "../../configs/database.js";

jest.mock("../../configs/database.js", () => ({
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

describe("Base Service", () => {
    let baseService;

    beforeEach(() => {
        baseService = new BaseService(prisma.user);
    });

    it("should get all data", async () => {
        prisma.user.findMany.mockImplementation(() => {
            return [
                {
                    id: 1,
                    name: "John Doe",
                    email: "john@mail.com",
                },
                {
                    id: 2,
                    name: "Jane Doe",
                    email: "jane@mail.com",
                },
            ];
        });

        const result = await baseService.getAll();
        expect(result).toEqual([
            {
                id: 1,
                name: "John Doe",
                email: "john@mail.com", 
            },
            {
                id: 2,
                name: "Jane Doe",
                email: "jane@mail.com",
            },
        ]);
        expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });

    it("should get data by id", async () => {
        prisma.user.findUnique.mockImplementation(() => {
            return {
                id: 1,
                name: "John Doe",
                email: "john@mail.com",
            };
        });

        const result = await baseService.getById(1);
        expect(result).toEqual({
            id: 1,
            name: "John Doe",
            email: "john@mail.com",
        });

        expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it("should create data", async () => {
        const data = {
            name: "John Doe",
            email: "john@mail.com",
        };

        prisma.user.create.mockImplementation(() => {
            return {
                id: 1,
                name: "John Doe",
                email: "john@mail.com",
            };
        });

        const result = await baseService.create(data);
        expect(result).toEqual({
            id: 1,
            name: "John Doe",
            email: "john@mail.com",
        });

        expect(prisma.user.create).toHaveBeenCalledTimes(1);

        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                name: "John Doe",
                email: "john@mail.com",
            },
        });
    });

    it("should update data", async () => {
        const data = {
            name: "John Doe",
            email: "john@mail.com", 
        };

        prisma.user.update.mockImplementation(() => {
            return {
                id: 1,
                name: "John Doe",
                email: "john@mail.com",
            };
        });

        const result = await baseService.update(1, data);
        expect(result).toEqual({
            id: 1,
            name: "John Doe",
            email: "john@mail.com",
        });

        expect(prisma.user.update).toHaveBeenCalledTimes(1);

        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                name: "John Doe",
                email: "john@mail.com",
            },
        });

    });

    it("should delete data", async () => {
        prisma.user.delete.mockImplementation(() => {
            return {
                id: 1,
                name: "John Doe",
                email: "john@mail.com",
            };
        });
        const result = await baseService.delete(1);
        expect(result).toEqual({
            id: 1,
            name: "John Doe",
            email: "john@mail.com",
        });

        expect(prisma.user.delete).toHaveBeenCalledTimes(1);

        expect(prisma.user.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });

    });
    
});
