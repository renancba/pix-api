# Pix API

Este projeto é uma API para gerenciar mensagens Pix, permitindo operações de leitura e escrita com um banco de dados PostgreSQL. A API está desenvolvida usando Node.js e Express.

## Instalação e Configuração

### 1. Clone o Repositório

Primeiro, clone o repositório para sua máquina local:

```bash
git clone https://github.com/seu-usuario/pix-api.git
cd pix-api 
```
### 2. Instale as Dependências
Certifique-se de que você tem o Node.js e o npm instalados. Então, instale as dependências do projeto:

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:

```bash
DB_URL=postgres://usuario:senha@localhost:5432
DB_NAME=nome_do_banco
PORT=8080
DB_URL: URL de conexão com o banco de dados PostgreSQL.
DB_NAME: Nome do banco de dados a ser criado e usado.
PORT: Porta na qual a API estará disponível.
```
### 4. Crie o Banco de Dados
Para criar o banco de dados, execute o script de criação:

```bash
node src/config/setupDB.js
```
Este script irá criar o banco de dados especificado no .env se ele ainda não existir.

### 5. Execute a API
Para iniciar a API, use o comando:

```bash
npm start
```
Por padrão, a API será iniciada na porta definida em PORT (por exemplo, 8080).

### 6. Teste a API
Você pode usar ferramentas como Postman ou curl para testar os endpoints da API. Certifique-se de que o servidor esteja rodando e acessível através da URL http://localhost:<PORT>.

Endpoints Disponíveis
GET /api/pix/{ispb}/stream/start: Inicia a recuperação de mensagens Pix.
GET /api/pix/{ispb}/stream/{interationId}: Continua a recuperação de mensagens Pix.
DELETE /api/pix/{ispb}/stream/{interationId}: Interrompe a recuperação de mensagens Pix.
POST /api/util/msgs/{number}/: Insere uma quantidade especificada de mensagens Pix no banco de dados.