const express = require('express')
const app = express()
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
// ******Actualmente solo soporta 3 pregutnas*****

// Archivos con las preguntas y las palabras
const words = JSON.parse(fs.readFileSync('words.json'))
const questions = JSON.parse(fs.readFileSync('questions.json'))

// Numero de pregutnas a enviar al cliente
const numberOfQuestions = 2

app.use(cors())
app.use(bodyParser.json())

// Para verificar el server
app.get('/', (req, res) => {
    res.sendStatus(200)
})

// Regresa las preguntas
app.get('/questions', (req, res) => {
    res.send(getRndQuestions(numberOfQuestions))
})

// Responde las preguntas
app.post('/answers', (req, res) => {
    res.send(req.body)
    fs.writeFileSync(`dump_${req.body.User.id}.txt`, JSON.stringify(req.body, null, '\t'), err => {
        if (err) throw err;
        console.log('File saved!');
    })
})

// por default en el puerto 3008 para que el cliente corra en el 3000
app.listen(3008, () => {
    console.log("listening", questions)
})

// Genera un entero positivo aleatorio
const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Selecciona palabras aleatorias del archivo
const getRndWords = size => {
    let newWords = []
    for (let i = 0; i < size; i++) {
        newWords.push(words[getRndInteger(0, words.length - 1)])
    }
    return newWords
}

// cada palabra se le asigna a cada pregunta
const getRndQuestions = size => {
    let wordAux = getRndWords(size)
    let newWords = []
    let res = []
    newWords = wordAux.slice(0, size).concat(wordAux.slice(0, size).concat(wordAux.slice(0, size)))
    for (let i = 0; i < newWords.length; i++) {
        let newObj = {
            Pregunta: questions[getPregunta(i, size)],
            Palabra: newWords[i].Palabra,
            Flibros: newWords[i].Flibros,
            Fsubtitulos: newWords[i].Fsubtitulos,
            Tipo: newWords[i].Tipo
        }
        res.push(newObj)
    }

    return res
}
const getPregunta = (i, size) => {
    if (i < size) return 0
    if (i >= size && i < size * 2) return 1
    if (i >= size * 2 && i < size * 3) return 2
}
