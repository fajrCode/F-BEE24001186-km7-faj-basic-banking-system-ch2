import ResponseHandler from "../utils/response.js";

export default class BaseCtrl {
    constructor(service) {
        this._service = service
        this.response = new ResponseHandler();
    }

    getAll = async (req, res) => {
        try {
            const data = await this._service.getAll();
            this.response.res200('Get All Data Success', data, res)
        }
        catch (error) {
            console.log(error)
            this.response.res500(res)
        }
    }

    getById = async (req, res) => {
        try {
            const id = req.params.id;
            const data = await this._service.getById(id);
            if (!data) {
                this.response.res404('Data Not Found', res)
            }
            this.response.res200('Get Data Success', data, res)
        }
        catch (error) {
            console.log(error)
            this.response.res500(res)
        }
    }

    create = async (req, res) => {
        try {
            const data = req.body;
            const newData = await this._service.create(data);
            this.response.res200('Create Data Success', newData, res)
        }
        catch (error) {
            console.log(error)
            this.response.res500(res)
        }
    }

    update = async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const updatedData = await this._service.update(id, data);
            if (!updatedData) {
                this.response.res404('Data Not Found', res)
            }
            this.response.res200('Update Data Success', updatedData, res)
        }
        catch (error) {
            console.log(error)
            this.response.res500(res)
        }
    }

    delete = async (req, res) => {
        try {
            const id = req.params.id;
            const deletedData = await this._service.delete(id);
            if (!deletedData) {
                this.response.res404('Data Not Found', res)
            }
            this.response.res200('Delete Data Success', deletedData, res)
        }
        catch (error) {
            console.log(error)
            this.response.res500(res)
        }
    }
}