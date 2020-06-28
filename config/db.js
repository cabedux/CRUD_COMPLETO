//requerimos la libreria mysql
const mysql      = require('mysql');

//funcion para crear la conexion con la bbdd
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'mobiles'
});
 
connection.connect(
    function(error){
        if(error){
            throw error;
        }
        else{
            console.log('Conexion establecida correctamente' + connection.config.database);
        }
    }
);

module.exports = connection;