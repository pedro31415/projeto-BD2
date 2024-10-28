const fastify = require('fastify')({logger: true})
const fastifyCors = require('@fastify/cors')
const { Pool } = require('pg')
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


fastify.get('/test-connection', async (request, reply) => {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        client.release();
        return {
            success: true, time: res.rows[0].now 
        };
    } catch(error){
        fastify.log.error(error);
        return { success: false, error: error.message };
    }
});

fastify.register(require('@fastify/postgres'), {
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
})

fastify.register(require('./routes/registerStudent'));
fastify.register(require('./routes/listStudent'));
fastify.register(require('./routes/updateStudent'));
fastify.register(require('./routes/deleteStudent'));

fastify.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})

const start = async () => {
    try {
        await fastify.listen({port: 3000});
        console.log('O servidor está funcionando')
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();