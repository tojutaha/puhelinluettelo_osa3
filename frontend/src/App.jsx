import { useState, useEffect } from 'react'
import Persons from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from "./services/persons" 
import Notification from './components/Notification'

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [originalPersons, setOriginalPersons] = useState(persons)
  const [filterInput, setFilterInput] = useState("")
  const [notificationMessage, setNotificationMessage] = useState()
  const [notificationType, setNotificationType] = useState()

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        //console.log("promise fulfilled")
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newEntry = {
      name: newName,
      number: newNumber,
    }

    const exists = persons.some(newEntry => newEntry.name === newName)
    if (exists) {
      const foundPerson = persons.find(person => person.name === newName)
      if (window.confirm(`${newEntry.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .updatePerson(foundPerson.id, newEntry)
          .then(() => {
            const newPersons = persons.map(person => person.id === foundPerson.id ? { ...person, number: newNumber } : { ...person,})
            setPersons(newPersons)
            setOriginalPersons(persons)
            setNewName('')
            setNewNumber('')
            setNotificationType("success")
            setNotificationMessage(
              `Updated ${foundPerson.name}`
            )
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
      } else {
        return;
      }
    } else {
      personService
        .createPerson(newEntry)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setOriginalPersons(originalPersons.concat(returnedPerson))
          setNotificationType("success")
          setNotificationMessage(
            `Added ${newEntry.name}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log("Error:", error)
        })
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      const id = person.id
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setOriginalPersons(persons)
          setNotificationType("success")
          setNotificationMessage(
            `Deleted ${person.name}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          setNotificationType("error")
          setNotificationMessage(
            `Information of ${person.name} has already been removed from server`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
          console.log("Error:", error)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const inputValue = event.target.value.toLowerCase()
    if (inputValue.length === 0) {
      setPersons(originalPersons)
    } else {
      setFilterInput(inputValue)
      const filter = originalPersons.filter(person => person.name.toLowerCase().includes(inputValue))
      setPersons(filter)
    }
  }

  const handleBackSpace =() => {
    const newFilterInput = filterInput.slice(0, -1)
    setFilterInput(newFilterInput)
    const filter = originalPersons.filter(person => person.name.toLowerCase().includes(newFilterInput));
    setPersons(filter);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} notificationType={notificationType}/>
      <Filter handleFilterChange={handleFilterChange} handleBackSpace={handleBackSpace} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} deletePerson={deletePerson} />
    </div>
  )

}

export default App