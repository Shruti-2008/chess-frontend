import axios from "axios"

const apiUrl = process.env.REACT_APP_API_URL
const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json"
    }
});


const login = (email: string, password: string) => {
    const formData = new FormData()
    formData.append("username", email)
    formData.append("password", password)
    api.post("/login", formData, { headers: { "Content-Type": "multipart/form-data" } })
        .then(response => {
            console.log(response.data.access_token)
            return(response.data.access_token)
        })
        .catch((error) => console.log(error))
    return ""
}

// const logout = () => {

// }

const signup = async (email: string, password: string) => {
    return api.post("/users", {email, password})
        .then(response => {
            console.log(response.data.access_token)
            return(response.data)
        })
        .catch((error) => {
            console.log(error)
            return(error)
        })
}

export { api, login, signup }