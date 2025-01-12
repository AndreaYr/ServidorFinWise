

class UserController {

    constructor(userService) {
        this.userService = userService;
    }

    register = async (req, res) => {
        return res.status(200).json({ 
            data: await this.userService.register(req.body.data) 
        });
    }
    
}


export default UserController;