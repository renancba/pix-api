const express = require('express');
const bodyParser = require('body-parser');
const pixRoutes = require('./src/routes/pixRoutes');

const app = express();

app.use(bodyParser.json()); // Para processar requisições JSON

app.use('/api', pixRoutes); // Usar as rotas definidas

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
