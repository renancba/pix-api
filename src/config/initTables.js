
const { Pool } = require('pg');
const { DB_URL, DB_NAME } = process.env;

const pool = new Pool({
    connectionString: `${DB_URL}/${DB_NAME}`,
});

const tableCreationQuery = `
CREATE TABLE IF NOT EXISTS pix_messages (
    ispb VARCHAR(20) PRIMARY KEY,
    endToEndId VARCHAR(255),
    valor DECIMAL(10, 2),
    pagador JSONB,
    recebedor JSONB,
    campoLivre TEXT,
    txId VARCHAR(255),
    dataHoraPagamento TIMESTAMP
);
`;

async function initializeTables() {
    try {
        await pool.query(tableCreationQuery);
        console.log('Tabela pix_messages criada ou já existe.');
    } catch (err) {
        console.error('Erro ao criar tabelas:', err);
    } finally {
        pool.end();
    }
}

module.exports = { initializeTables };
