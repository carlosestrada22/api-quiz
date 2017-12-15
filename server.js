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
    for (let i = 0; i < questions.length; i++) {
        for (let j = 0; j < wordAux.length; j++) {
            (function (wordAux, j) {
                // wordAux[j].Pregunta = questions[i]
                newWords.push(wordAux[j])
            })(wordAux, j)
        }
    }
    for (let i = 0; i < 20; i++) newWords[i].Pregunta = questions[0]
    for (let i = 20; i < 40; i++) newWords[i].Pregunta = questions[1]
    for (let i = 40; i < 60; i++) newWords[i].Pregunta = questions[2]

    console.log(newWords.length)
    return newWords
}