const express = require('express')
const app = express()
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
// ******Actualmente solo soporta 3 pregutnas*****

// Archivos con las preguntas y las palabras
const words = JSON.parse(fs.readFileSync('words.json'))
const questions = JSON.parse(fs.readFileSync('questions.json'))

// Numero de pregutnas a enviar al cliente
const numberOfQuestions = 2

app.use(cors())
app.use(bodyParser.json())

app.use(express.static('build/'))
app.get('/', (req, res) => {
    console.log(path.join(__dirname, '/build/'))
    res.sendFile(path.join(__dirname, '/build/index.html'))
})
// Regresa las preguntas
app.get('/questions', (req, res) => {
    res.send(getRndQuestions(numberOfQuestions))
})

// Responde las preguntas
app.post('/answers', (req, res) => {
    // res.send(req.body)
    fs.writeFileSync(`dump_${req.body.User.id}.txt`, JSON.stringify(req.body, null, '\t'), err => {
        if (err) throw err;
        console.log('File saved!');
    })
    res.send(Evaluar(req.body.Respuestas))
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
const Evaluar = Respuestas => {
    // console.log(Respuestas[0].Respuesta)

    let eva = [0, 0, 0, 0, 0]

    for (let i = 0; i < Respuestas.length - 1; i++) {
        console.log(Respuestas[i], i)
        if (Respuestas[i].Respuesta === 1) eva[0]++
        if (Respuestas[i].Respuesta === 2) eva[1]++
        if (Respuestas[i].Respuesta === 3) eva[2]++
        if (Respuestas[i].Respuesta === 4) eva[3]++
        if (Respuestas[i].Respuesta === 5) eva[4]++
    }
    let index = eva.indexOf(Math.max(...eva));

    switch (index) {
        case 1:
            return "Para ti las palabras son poco significativas"
            break;
        case 2:
            return "Para ti las palabras no tienen mucho poder"
            break;
        case 3:
            return "Para ti las palabras tienen fuerza y valor, pero no son determinantes"
            break;
        case 4:
            return "Las palabras son muy importantes para ti"
            break;
        case 5:
            return "En ti las palabras ejercen mucho control y fuerza"
            break;
    }

}
