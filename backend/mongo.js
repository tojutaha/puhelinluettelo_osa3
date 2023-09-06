const mongoose = require("mongoose");

console.log(process.argv.length)

if ( process.argv.length < 3) {
    console.log("Usage: node mongo.js <password> to view phonebook")
    console.log("Usage: node mongo.js <password> <\"name\"> <number> to add new entry into phonebook")
    process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://tomihalko:${password}@cluster0.fgsgs5a.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String,
})

const Note = mongoose.model('Note', phonebookSchema)
if (process.argv.length == 3) {
    console.log("phonebook:")

    Note.find({}).then(result => {
        result.forEach(note => {
            console.log(note.name, note.number)
        })
        mongoose.connection.close()
    })

} else if (process.argv.length == 5) {
    const note = new Note({
        name: process.argv[3],
        number: process.argv[4],
        id: process.argv[4],
    })

    note.save().then(result => {
        console.log("note saved!")
        mongoose.connection.close()
    })
} else {
    console.log("Invalid amount of arguments")
    mongoose.connection.close();
}
