import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ handleSearchChange }) => {
	return (
		<div>
			filter shown with <input onChange={handleSearchChange} />
		</div>
	)
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
	return (
		<form onSubmit={addPerson}>
			<div>
				name: <input value={newName} onChange={handleNameChange} />
			</div>
			<div>
				number: <input value={newNumber} onChange={handleNumberChange} />
			</div>
			<div>
				<button type='submit'>add</button>
			</div>
		</form>
	)
}

const Person = ({ persons, deletePerson }) => {
	return (
		<>
			{persons.map((person) => (
				<div key={person.name}>
					{person.name}
					{person.number}
					<button onClick={() => deletePerson(person)}>delete</button>
				</div>
			))}
		</>
	)
}

const App = () => {

	const [persons, setPersons] = useState([])
	useEffect(() => {
		personService
			.getAll()
			.then(initialPersons => {
				setPersons(initialPersons);
			})
	}, [])

	const [originalPersons] = useState(persons)

	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [newSearch, setNewSearch] = useState('')
	const [notificationMessage, setNotificationMessage] = useState(null)
	const [notificationType, setNotificationType] = useState()

	const NotificationMessage = (message) => {
		setNotificationMessage(message)
		setTimeout(() => {
			setNotificationMessage(null)
		}, 3000)
	}

	const AddPerson = (event) => {
		event.preventDefault()

		const newPerson = {
			name: newName,
			number: newNumber,
		}

		if (newName.length <= 0) {
			console.log("Tried to add empty string")
			return
		}

		const found = persons.some(person => person.name === newName)
		if (found) {
			if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
				const foundPerson = persons.find(person => person.name === newName)
				personService
					.updatePerson(foundPerson.id, newPerson)
					.then((returnedPerson) => {
						setPersons(persons.map(person => person.name === newName ? returnedPerson : person))
						setNewName("")
						setNewNumber("")
						setNotificationType('success')
						NotificationMessage(`Updated ${newPerson.name}`)
					})
			}
		}
		else {
			personService
				.createPerson(newPerson)
				.then(returnedPerson => {
					setPersons(persons.concat(returnedPerson))
					setNewName("")
					setNewNumber("")
					setNotificationType('success')
					NotificationMessage(`Added ${newPerson.name}`)
				})
				.catch(error => {
					//console.log(error.response.data.error)
					setNotificationType('error')
					NotificationMessage(`${error.response.data.error}`)
				})
		}
	}

	const DeletePerson = (person) => {
		if (window.confirm(`Delete ${person.name}?`)) {
			const id = person.id
			personService
				.deletePerson(id)
				.then(() => {
					setPersons(persons.filter(person => person.id !== id))
					setNotificationType('success')
					NotificationMessage(`Deleted ${person.name}`)
				})
				.catch(error => {
					setNotificationType('error')
					NotificationMessage(`person '${person.name}' was already deleted from server`)
					setPersons(persons.filter(p => p.id !== id))
				})
		}
	}

	const handleNameChange = (event) => {
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}

	const handleSearchChange = (event) => {
		const input = event.target.value
		setNewSearch(input)

		if (input.length === 0) {
			setPersons(originalPersons)
		} else {
			const filter = originalPersons.filter(person => person.name.toLowerCase().includes(input.toLowerCase()))
			setPersons(filter)
		}
	}

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={notificationMessage} notificationType={notificationType} />
			<Filter handleSearchChange={handleSearchChange} />
			<br />
			<PersonForm addPerson={AddPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
			<h2>Numbers</h2>
			<Person persons={persons} deletePerson={DeletePerson} />
		</div>
	)

}

export default App
