import AccountCtrl from "../account.controller";
import AccountService from "../../services/account.service";
import { Error400 } from "../../utils/custom_error";

jest.mock("../../services/account.service");

describe('account controller', () => { 
    let mockData1;
    let mockData2;
    
    beforeEach(() => {
        AccountService.mockClear();	
        mockDataAccount1 = {
            "id": 1,
            "userId": 1,
            "bankName": "Bank Binar 2",
            "bankAccountNumber": "1234567892",
            "balance": 1000000,
            "user": {
                "id": 3,
                "name": "fulan",
                "email": "fulan2@gmail.com"
            }
        }
    });

    describe('get all account', () => { 
        it('should return all account', async () => {

        })
     })

 })