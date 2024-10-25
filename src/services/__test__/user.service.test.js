import UserService from '../user.service';

jest.mock('../user.service.js');

describe('User Service Testing', () => {
    let userService;

    beforeEach(()=>{
        userService = new UserService();
    })

    test('should get all data user', () => { 
        it('get all users', async () => {
            const users = await userService.getAll();
            UserService.prototype.getAll.mockResolvedValueOnce([{ id: 1, name: "Fulan", email: "fulan@gmail.com" }])
            expect(users).toEqual(expect.any(Array));
        });
     })
});