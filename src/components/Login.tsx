import { useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthProvider";
import { api } from "../services/authService"

function Login() {

    const { setAuth } = useContext(AuthContext)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ "email": "", "password": "" })
    const [errorText, setErrorText] = useState("")
    const errRef = useRef<HTMLParagraphElement>(null)


    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const bodyFormData = new FormData()
            bodyFormData.append("username", formData.email)
            bodyFormData.append("password", formData.password)
            api.post("/login", bodyFormData, { headers: { "Content-Type": "multipart/form-data" } })
                .then(response => {
                    setAuth(response.data.access_token)
                    navigate("/menu")
                    setErrorText("")
                })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        setErrorText(error.response.data.detail)
                    } else if (error.request) {
                        setErrorText("No response from server")
                    } else {
                        setErrorText("Unexpected error occured")
                    }
                    errRef.current?.focus()
                })
        } catch (error) {
            setErrorText("Unexpected error occured")
            errRef.current?.focus()
        }
    }

    function handleChange(e: React.ChangeEvent) {
        var element = e.target as HTMLInputElement
        const name = element.name
        const value = element.value
        setFormData(data => ({ ...data, [name]: value }))
        setErrorText("")
    }

    return (
        <div className="m-auto bg-slate-400 h-screen text-lg w-full">
            <form
                onSubmit={e => handleSubmit(e)}
                className="h-3/4 text-lg m-auto p-4 w-full rounded-xl bg-slate-200 mt-6 md:w-1/2 flex flex-col justify-around"
            >
                <div className="flex flex-col justify-around mx-auto w-4/5 max-w-lg">
                    <p ref={errRef} className="text-red-500 py-2 font-semibold">{errorText}</p>
                    <label
                        htmlFor="email"
                        className="font-semibold text-xl py-2 ">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        className="rounded-lg p-2 border-2 border-slate-300 "
                        onChange={e => handleChange(e)} />

                    <label
                        htmlFor="password"
                        className="font-semibold text-xl py-2 mt-8 ">
                        Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        className="rounded-lg p-2 border-2 border-slate-300"
                        onChange={e => handleChange(e)} />
                    <button
                        type="submit"
                        className="bg-amber-300 px-8 py-4 mt-40 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400">
                        Login
                    </button>
                </div>

                <p className="text-center">Don't have an account? <Link to="/register" className="text-blue-600 underline hover:text-blue-800">Register</Link></p>
            </form>
        </div>)
}

export default Login