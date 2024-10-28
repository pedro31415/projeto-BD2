async function listStudentsRoute(fastify, options) {
    fastify.get('/students', async (request, reply) => {
        const client = await fastify.pg.connect();
        try {
            const result = await client.query('SELECT * FROM aluno');
            reply.send(result.rows)
        } catch (error) {
            reply.status(500).send({error: 'Erro ao listar alunos. '})
        } finally {
            client.release();
        }
    })
}

module.exports = listStudentsRoute;