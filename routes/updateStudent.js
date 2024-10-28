async function updateStudentRoute(fastify, options) {
    fastify.put('/students/:id', async (request, reply) => {
        const { id } = request.params;
        const { nome, sexo, data_nascimento, cidade, estado, endereco, email, telefone } = request.body; 
        const client = await fastify.pg.connect();

        try {

            console.log("Id recebido: ", id)
            const query = `
                UPDATE aluno 
                SET nome = COALESCE($1, nome),
                    sexo = COALESCE($2, sexo),
                    data_nascimento = COALESCE($3, data_nascimento),
                    cidade = COALESCE($4, cidade),
                    estado = COALESCE($5, estado),
                    endereco = COALESCE($6, endereco),
                    email = COALESCE($7, email),
                    telefone = COALESCE($8, telefone)
                WHERE id_aluno = $9
                RETURNING *;
            `;

            const values = [nome, sexo, data_nascimento, cidade, estado, endereco, email, telefone, id];
            const result = await client.query(query, values);


            if (result.rowCount > 0) {
                reply.send({ status: 'Aluno atualizado com sucesso!', aluno: result.rows[0] });
            } else {
                reply.status(404).send({ error: 'Aluno não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao executar a query:', error);
            fastify.log.error('Erro ao atualizar aluno', error);
            reply.status(500).send({ error: 'Erro ao atualizar aluno.' });
        } finally {
            client.release();
        }
    });
}

module.exports = updateStudentRoute;
