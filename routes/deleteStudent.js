async function deleteStudentRoute(fastify, options) {
    fastify.delete('/students/:id', async (request, reply) => {
        const { id } = request.params;
        const client = await fastify.pg.connect();

        try {
            console.log("Id recebido para exclusão: ", id)
            const query = `DELETE FROM aluno WHERE id_aluno = $1 RETURNING *;`

            const result = await client.query(query, [id]);

            if(result.rowCount > 0) {
                reply.send({status: 'Aluno excluído com sucesso!', aluno: result.rows[0]});
            } else {
                reply.status(400).send({error: 'Aluno não encontrado'});
            }
        } catch (error) {
            console.error('Erro ao executar a query', error);
            fastify.error('Erro ao excluir o aluno', error);
            reply.status(500).send({error: "Erro ao excluir aluno. "});
        } finally {
            client.release();
        }
    })
}


module.exports = deleteStudentRoute