const pool = require('../config/database');

const getMessages = async (ispb, limit) => {
  const query = `SELECT * FROM pix_messages WHERE ispb = $1 ORDER BY id ASC LIMIT $2`;
  const values = [ispb, limit];
  const result = await pool.query(query, values);
  return result.rows;
};

async function insertMessages(messages) {
    const query = `
      INSERT INTO pix_messages (endToEndId, valor, pagador, recebedor, campoLivre, txId, dataHoraPagamento, ispb)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

  try {
    await Promise.all(messages.map(async (msg) => {
        await pool.query(query, [
          msg.endToEndId,
          msg.valor,
          msg.pagador,
          msg.recebedor,
          msg.campoLivre,
          msg.txId,
          msg.dataHoraPagamento,
          msg.ispb
        ]);
      }));
  } catch (err) {
    console.error('Error inserting messages:', err);
    throw err;
  }
}
const deleteMessages = async (ispb) => {
  const query = `DELETE FROM pix_messages WHERE ispb = $1`;
  await pool.query(query, [ispb]);
};

module.exports = {
    getMessages,
  insertMessages,
  deleteMessages,
};
