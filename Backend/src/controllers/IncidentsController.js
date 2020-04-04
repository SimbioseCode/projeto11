const connection = require('../database/connection')

//exportando um objeto
module.exports = {
    //SELECT
    async index (request,response) {
        const { page = 1 } = request.query 

        const [count] = await connection('incidents').count() //[count] trazendo apenas um registro
        
        console.log({count})

        const incidents = await connection('incidents')
        .join('ongs','ongs.id', '=', 'incidents.ong_id') // juntando duas tabeelas
        .limit(5)
        .offset((page - 1) * 5) //calculo para trazer de 5 em cinco registros
        .select(['incidents.*',
            'ongs.name', 
            'ongs.email',
            'ongs.whatapp',
            'ongs.city',
            'ongs.uf'
        ]); //buscando os campos especificos

        //para usar http://localhost:3333/incidents?page=1 depois page2 no insominia

    response.header('X-Total-Count', count['count(*)']); //retornando o total no cabeçado da responta
    return response.json(incidents);
},

    //CREATE
    async create (request,response) {
        const { title,descrition, value } = request.body;
        
        const ong_id = request.headers.authorization;

        //const id é uma desestruturacao para receber o resultado do insert em uma variavel chamada id
        const [id] = await connection('incidents').insert({
            title,
            descrition, 
            value,
            ong_id,
        });

        return response.json({id})
    },

    //DELETE
    async delete(request,response){ 
        const {id} = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id',id) // se id da tabela for igual o do params
            .select('ong_id')//buscando a coluna ong_id
            .first()//retornando apenas um resultado para seguranca

            if(incident.ong_id != ong_id) {// se o ong_id do banco for diferendo do logado na aplicacao
                return response.status(401).json({error: 'Operation not permitted.'})
            }
            await connection('incidents').where('id',id).delete()

            return response.status(204).send();//enviando a respota de sucesso sem corpo vazia


    }
}