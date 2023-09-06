const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())

morgan.token('response-json', function (req, res) {
    //console.log("Method: ", req.method)
    //console.log("res:", res.body)
    //console.log("req:", req.body)
    if (req.method === "GET") {
        return ""
    }
    // Log for post, delete, put and patch
    return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['response-json'](req, res)
    ].join(' ')
  }))

let persons = [
    {
        name: "Arto Hellas",
        number: "000",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]
  
/*
app.get("/", (req, res,) => {
    res.send("Nothing to see here.")
})
*/

app.get("/info/", (req, res,) => {
    let currentDate = new Date()
    const html = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentDate.toString()}</p>
    `
    res.send(html)
})

app.get("/api/persons/", (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id  = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateID = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post("/api/persons", (req, res) => {
    const body = req.body
    if (!body.name) {
        return res.status(400).json({
            error: "name missing"
        })
    }

    const exists = persons.some(person => person.name === body.name)
    if (exists) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: "number missing"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateID(),
    }

    persons = persons.concat(person)
    //console.log(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})