const { Pool } = require('pg');
const pool = require('../config/database');

const getMessages = async (ispb, limit) => {
    const query = `
    SELECT * FROM messages
    WHERE recebedor_ispb = $1
    ORDER BY dataHoraPagamento ASC
    LIMIT $2;
  `;

    const { rows } = await pool.query(query, [ispb, limit]);
    return rows;
};

const insertMessage = async (message) => {
    const query = `
    INSERT INTO messages (
      endToEndId, valor, pagador_nome, pagador_cpfCnpj, pagador_ispb, pagador_agencia,
      pagador_contaTransacional, pagador_tipoConta, recebedor_nome, recebedor_cpfCnpj,
      recebedor_ispb, recebedor_agencia, recebedor_contaTransacional, recebedor_tipoConta,
      campoLivre, txId, dataHoraPagamento
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    );
  `;

    await pool.query(query, [
        message.endToEndId, message.valor,
        message.pagador.nome, message.pagador.cpfCnpj, message.pagador.ispb, message.pagador.agencia,
        message.pagador.contaTransacional, message.pagador.tipoConta,
        message.recebedor.nome, message.recebedor.cpfCnpj, message.recebedor.ispb, message.recebedor.agencia,
        message.recebedor.contaTransacional, message.recebedor.tipoConta,
        message.campoLivre, message.txId, message.dataHoraPagamento
    ]);
};

module.exports = {
    getMessages,
    insertMessage
};
