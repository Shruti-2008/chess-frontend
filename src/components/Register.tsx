import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthProvider";
import {api} from "../services/authService";

function Register() {

    const [formData, setFormData] = useState({ "email": "", "password": "", "confirmPassword": "" })
    const [errorText, setErrorText] = useState("")
    const errRef = useRef<HTMLParagraphElement>(null)
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const navigate = useNavigate()
    const { setAuth } = React.useContext(AuthContext)

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            api.post("/users", { email: formData.email, password: formData.password })
                .then(response => {
                    console.log(response.data.access_token)
                    setAuth(response.data.access_token)
                    navigate("/game")
                    setErrorText("")
                })
                .catch((error) => {
                    if (error.response && error.response.status === 409) {
                        setErrorText(error.response.data.detail)
                    } else if (error.request) {
                        setErrorText("No response from server")
                    } else {
                        setErrorText("Unexpected error occured")
                    }
                    errRef.current?.focus()
                })
        }
        catch (err) {
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
                className="h-3/4 text-lg m-auto p-4 w-full rounded-xl bg-slate-200 md:w-1/2 flex flex-col justify-around"
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
                        className="rounded-lg p-2 border-2 border-slate-300"
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
                    <p className="text-red-500">{formData.password.length > 0 && !re.test(formData.password) ? "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character [@$!%*?&]" : ""}</p>
                    <label
                        htmlFor="confirmPassword"
                        className="font-semibold text-xl py-2 mt-8">
                        Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        className="rounded-lg p-2 border-2 border-slate-300"
                        onChange={e => handleChange(e)}
                        disabled={formData.password.length === 0 || !re.test(formData.password)} />
                    <p className={(formData.confirmPassword.length !== 0) ? (formData.password === formData.confirmPassword ? "text-green-500" : "text-red-500") : ""}>{(formData.confirmPassword.length !== 0) && (formData.password === formData.confirmPassword ? "Passwords match" : "Passwords don't match")}</p>
                    <button
                        type="submit"
                        className="bg-amber-300 px-8 py-4 mt-24 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400">
                        Register
                    </button>
                </div>
                <p className="text-center">Already have an account? <Link to="/login" className="text-blue-600 underline hover:text-blue-800">Login</Link></p>
            </form>
        </div>)
}

export default Register