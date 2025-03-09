class UserController {

    constructor(userService) {
        this.userService = userService;
    }

    register = async (req, res) => {
        try{
            const result = await this.userService.register(req.body);
            return res.status(200).json({ data: result });
        }catch (error){
            return res.status(400).json({ error: error.message });
        }

    }
    
    login = async (req, res) => {

        try{
            const result = await this.userService.login(req.body);
            return res.status(200).json({ data: result});
        }catch (error){
            return res.status(400).json({ error: error.message});
        }
    }

    profile = async (req, res) => {
        return res.status(200).json({ 
            data: `Tu email leído en tu token es: ${req.dataToken.userEmail}`
        });
    }
}


export default UserController;