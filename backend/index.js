require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())

////////////////////
// morgan
morgan.token('response-json', function (req, res) {
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

app.get("/api/persons/", (req, res) => {
  Person.find({}).then(person => {
    res.json(person)
  })
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(person => {
      res.status(204).end()
    })
    .catch(error = next(error))
})

app.post("/api/persons", (req, res) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).json({
      error: "name missing"
    })
  }

  /*
  const exists = persons.some(person => person.name === body.name)
  if (exists) {
      return res.status(400).json({
          error: "name must be unique"
      })
  }
  */

  if (!body.number) {
    return res.status(400).json({
      error: "number missing"
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

////////////////////
// Error handling
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
// virheellisten pyyntöjen käsittely
app.use(errorHandler)

////////////////////
// Run app
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})