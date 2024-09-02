
const { Pool } = require('pg');
const { DB_URL, DB_NAME } = process.env;

const adminPool = new Pool({
    connectionString: DB_URL,
    database: 'postgres',
});

async function createDatabase() {
    try {
        const result = await adminPool.query(
            `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`
        );

        if (result.rowCount === 0) {
            console.log(`Criando banco de dados ${DB_NAME}`);
            await adminPool.query(`CREATE DATABASE ${DB_NAME}`);
        } else {
            console.log(`Banco de dados ${DB_NAME} já existe.`);
        }
    } catch (err) {
        console.error('Erro ao criar banco de dados:', err);
    } finally {
        adminPool.end();
    }
}

async function connectToDatabase() {
    try {
        await adminPool.connect();
        console.log(`Conectado ao banco de dados ${DB_NAME}`);
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
}

module.exports = { createDatabase, connectToDatabase };
