class UserController {

    constructor(userService) {
        this.userService = userService;
    }
    

    register = async (req, res) => {
        try{
            const result = await this.userService.register(req.body);
            return res.status(200).json({ data: "ok"});
        }catch (error){
            return res.status(400).json({ error: error.message });
        }

    }
    
    login = async (req, res) => {

        try{
            const { token, usuario } = await this.userService.login(req.body);
            return res.status(200).json({ message: 'Inicio de sesión exitoso', token, usuario });
        }catch (error){
            return res.status(400).json({ error: error.message});
        }
    }

    //Solicitar recuperacón de contraseña
    forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
              throw new Error('Email requerido');
            }
            await this.userService.forgotPassword(email);
            return res.status(200).json({ message: 'Correo enviado con instrucciones' });
          } catch (error) {
            return res.status(400).json({ error: error.message });
          }
    }

    resetPassword = async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
              throw new Error('Faltan datos');
            }
        
            await this.userService.resetPassword(token, newPassword);
            return res.status(200).json({ message: 'Contraseña restablecida con éxito' });
          } catch (error) {
            return res.status(400).json({ error: error.message });
          }
    }

    profile = async (req, res) => {

        try{
            return res.status(200).json({ 
                data: `Tu email leído en tu token es: ${req.dataToken.userEmail}`
            });
        }catch(error){
            return res.status(400).json({ error: error.message });
        }
    }
}


export default UserController;