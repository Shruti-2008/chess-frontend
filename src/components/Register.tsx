import { isDisabled } from "@testing-library/user-event/dist/utils";
import React from "react";
import {Link} from "react-router-dom"

function Register() {

    const [formData, setFormData] = React.useState({ "email": "", "password": "", "confirmPassword":"" })
    const re=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
    }

    function handleChange(e: React.ChangeEvent) {
        var element = e.target as HTMLInputElement
        const name = element.name
        const value = element.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    return (
        <div className="m-auto bg-slate-300 h-screen text-lg">
            <form
                onSubmit={e => handleSubmit(e)}
                className="h-3/4 text-lg m-auto p-4 w-full rounded-xl bg-slate-100 md:w-1/2 flex flex-col justify-around"
            >
                <div className="flex flex-col justify-around ">
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
                    <p className="text-red-500">{formData.password.length>0 && !re.test(formData.password)?"Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character [@$!%*?&]":""}</p>
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
                        disabled={formData.password.length===0 || !re.test(formData.password)}/>
                    <p className={(formData.confirmPassword.length !== 0) ? (formData.password === formData.confirmPassword ? "text-green-500":"text-red-500"):""}>{(formData.confirmPassword.length !== 0) && (formData.password === formData.confirmPassword ? "Passwords match":"Passwords don't match")}</p>
                </div>
                <button
                    type="submit"
                    className="bg-amber-300 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400">
                    Register
                </button>
                <p className="text-center">Already have an account? <Link to="/login" className="text-blue-600 underline hover:text-blue-800">Login</Link></p>
            </form>
        </div>)
}

export default Register