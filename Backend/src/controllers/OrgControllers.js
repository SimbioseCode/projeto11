
const crypto = require('crypto')
const connection = require('../database/connection')

//exportando um objeto
module.exports = {
    async index (request,response) {
    const ongs = await connection('ongs').select('*');
    return response.json(ongs);
    },


    async create(request,response) {          
    //const data = request.body;
    const { name, email, whatapp, city, uf } = request.body; //desestruturacao de dados{dados dentro}
    const id = crypto.randomBytes(4).toString('HEX'); //CRIPTOGRAFIA NODE

    //console.log(data)     
    await connection('ongs').insert({
      id,
      name,
      email,
      whatapp,
      city, 
      uf,
    }) 

    return response.json({ id });
    }
}