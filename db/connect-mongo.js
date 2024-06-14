const mongoose = require('mongoose');



const getConnection = async () => {
    try {
        const url = 'mongodb://127.0.0.1:27017/mongodb-Inventarios';

        await mongoose.connect(url);
        console.log('conexion exitosa');
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    getConnection,
}


