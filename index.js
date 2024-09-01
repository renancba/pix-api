const express = require('express');
const bodyParser = require('body-parser');
const pixRoutes = require('./src/routes/pixRoutes');
const { initializeTables } = require('./src/config/initTables');
const { createDatabase } = require('./src/config/setupDB');

const app = express();

app.use(bodyParser.json()); 

app.use('/api', pixRoutes); 

createDatabase().then(() => {
  initializeTables().then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT || 8080}`);
    });
  });
});