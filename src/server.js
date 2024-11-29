
import app from "./app.js"

// mandando comando para iniciar servidor e porta ( segunda função é um callback )= retornando informação como está
app.listen(3001, () => console.log('Server is running at port 3001'))