import multer from "multer";
import { extname, resolve } from "path";
import { v4 } from "uuid";



// config apos type
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// fim


// definindo configuracoes do multer como vai receber onde vai enviar e nome
// multer vai receber file do storage
// destino onde vai salvar - __dirname
//como vai retorna arquivo - usando uuid para não ter conflito com nomes duplicados
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "uploads"),
    filename: (request, file, callback) => {
      return callback(null, v4() + extname(file.originalname));
    },
  }),
};
