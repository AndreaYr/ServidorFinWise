class DashboardController {
     async getData(req, res){

      try {
        const data = await someService.getData();
        res.json(data);

        }catch(error){
            res.status(500).json({message: 'Error al obtener los datos'});
        }
     };
}

export default DashboardController;
