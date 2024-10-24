
import ModelMongoDB from "./productosMongoDB.js"

class ModelFactoryProducts {
    static get(tipo) {
        switch (tipo) {

            case 'MONGODB':
                console.log('**** Persistiendo en MongoDB ****')
                return new ModelMongoDB()

            default:
                console.log('**** Persistiendo en MongoDB ****')
                return new ModelMongoDB()
        }
    }
}

export default ModelFactoryProducts