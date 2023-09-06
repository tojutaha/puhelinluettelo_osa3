import axios from 'axios'
const baseUrl = "/api/persons"

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }
  
  const createPerson = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
  }

  const deletePerson = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(() => {
      // Nothing to return
    })
  }

  const updatePerson = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(() => {
    })
  }
  
  export default { getAll, createPerson, deletePerson, updatePerson }