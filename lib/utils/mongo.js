const mongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_HOST;
const dataBase = process.env.DB_NAME;

function mongoUtils() {
  const mu = {};

  // Esta variable almacenará la conexión a MongoDB.
  // Tenga presente que es una promesa que deberá ser resuelta. 
  mu.conn = () => {
    const client = new mongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return client.connect();
  };
  return mu;
}

process.on('SIGINT', async function () {
  console.log('connection ended');
  const client = await mongoUtils().conn();
  client.close().then((data) => console.log('conn ended'));
});

exports.mongoUtils = mongoUtils();
exports.dataBase = dataBase;
