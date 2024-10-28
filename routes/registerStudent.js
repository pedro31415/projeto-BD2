async function registerStudentRoute(fastify, options) {
    fastify.post('/register', async(request, reply) => {
        const {nome, sexo, data_nascimento, cidade, estado, endereco, email, telefone} = request.body;
        const client = await fastify.pg.connect();

        try  {
            await client.query(
                'INSERT INTO aluno (nome, sexo, data_nascimento, cidade, estado, endereco, email, telefone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [nome, sexo, data_nascimento, cidade, estado, endereco, email, telefone]
            );
            reply.send({status: 'Aluno Cadastrado com sucesso!'});
        } catch (error){
            fastify.log.error('Erro ao cadastrar aluno:', error);
            reply.status(500).send({error: 'Erro ao cadastrar aluno.'});
        } finally {
            client.release();
        }
    })
}

module.exports = registerStudentRoute;