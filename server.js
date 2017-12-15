const express = require('express')
const app = express()
const fs = require('fs')
const cors = require('cors')

const words = JSON.parse(fs.readFileSync('words.json'))
const questions = JSON.parse(fs.readFileSync('questions.json'))
app.use(cors())

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.get('/questions', (req, res) => {
    res.send(getRndQuestions(20))
})

app.listen(3008, () => {
    console.log("listening", questions)
})

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRndWords = size => {
    let newWords = []
    for (let i = 0; i < size; i++) {
        newWords.push(words[getRndInteger(0, words.length - 1)])
        //words[i].Pregunta = "Qué tal, lokis?"
    }
    return newWords
}

const getRndQuestions = size => {
    let wordAux = getRndWords(size)
    let newWords = []
    let res = []
    newWords = wordAux.slice(0, 20).concat(wordAux.slice(0, 20).concat(wordAux.slice(0, 20)))
    for (let i = 0; i < newWords.length; i++) {
        let newObj = {
            Pregunta: questions[getPregunta(i)],
            Palabra: newWords[i].Palabra,
            Flibros: newWords[i].Flibros,
            Fsubtitulos: newWords[i].Fsubtitulos,
            Tipo: newWords[i].Tipo
        }
        res.push(newObj)
    }

    return res
}
const getPregunta = (i) => {
    if (i < 20) return 0
    if (i >= 20 && i < 40) return 1
    if (i >= 40 && i < 60) return 2
}
