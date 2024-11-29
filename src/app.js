
import express from 'express';
import { resolve } from 'node:path';
import cors from 'cors';

// Importação automática do arquivo de configuração do banco de dados
import './database/index.js'; // Certifique-se de incluir a extensão .js

// Importando as rotas
import routes from './routes.js';

// Para compatibilidade com ES Modules, substituindo __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtendo o __dirname para compatibilidade com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class App {
  constructor() {
    this.app = express(); // Criação da instância do Express
    
    // Configuração do CORS permitindo apenas o domínio específico
    const corsOptions = {
      origin: 'https://olimpos.netlify.app', // Permite apenas este domínio
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite os métodos necessários
    };

    this.app.use(cors(corsOptions)); // Habilitando CORS com as opções configuradas

    this.middlewares(); // Configurando middlewares
    this.routes(); // Configurando as rotas
  }

  middlewares() {
    // Configuração para interpretar JSON e fornecer arquivos estáticos
    this.app.use(express.json());
    this.app.use('/products-file', express.static(resolve(__dirname, '..', 'uploads')));
    this.app.use('/category-file', express.static(resolve(__dirname, '..', 'uploads')));
  }

  routes() {
    this.app.use(routes); // Definindo as rotas
  }
}

// Exportando a instância da aplicação para uso em outros módulos
export default new App().app;
