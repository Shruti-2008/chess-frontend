import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthProvider";
import { api } from "../services/authService"

function Login() {

    const { setAuth } = useContext(AuthContext)
    const errRef = useRef<HTMLParagraphElement>(null)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ "email": "", "password": "" })
    const [errorText, setErrorText] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
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

    useEffect(()=>{
        setAuth("")
    }, [])

    return (
        <div className="m-auto p-6 h-full w-full text-lg bg-slate-400">{/* border-2 border-amber-300 */}
            <form
                onSubmit={e => handleSubmit(e)}
                className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 m-auto box-border px-2 py-6 md:py-12 text-lg rounded-xl bg-slate-200"
            >
                <div className="flex flex-col justify-between space-y-20 mx-4 md:w-4/5 md:max-w-lg md:mx-auto">
                    <div className="flex flex-col justify-between">
                        {errorText && <div ref={errRef} className="text-red-500 p-2 mb-4 font-semibold bg-red-100 shadow-md rounded-lg border-red-500 border-2">{errorText}!</div>}
                        <label
                            htmlFor="email"
                            className="font-semibold text-xl py-2">
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
                            className="font-semibold text-xl py-2 mt-8">
                            Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            className="rounded-lg p-2 border-2 border-slate-300"
                            onChange={e => handleChange(e)} />
                    </div>
                    <div className="flex flex-col justify-between space-y-10">
                        <button
                            type="submit"
                            className="bg-amber-300 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400">
                            Login
                        </button>
                        <p className="text-center">Don't have an account? <Link to="/register" className="text-blue-600 underline hover:text-blue-800">Register</Link></p>
                    </div>
                </div>
            </form>
        </div>)
}

export default Login