// services/baseService.js
export default class BaseService {
    constructor(model) {
        this._model = model;
    }

    async getAll() {
        return await this._model.findMany();
    }

    async getById(id) {
        return await this._model.findUnique({ where: { id: Number(id) } });
    }

    async create(data) {
        return await this._model.create({ data });
    }

    async update(id, data) {
        return await this._model.update({ where: { id: Number(id) }, data });
    }

    async delete(id) {
        return await this._model.delete({ where: { id: Number(id) } });
    }
}