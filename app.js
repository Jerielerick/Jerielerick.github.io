require( 'dotenv').config();
const Server = require('./Models/Server');

const server = new Server();
server.createServer();
