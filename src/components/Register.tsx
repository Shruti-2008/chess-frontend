import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorText, setErrorText] = useState("");
  const errRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      AuthService.signup(formData.email, formData.password)
        .then((response) => {
          if (response?.data?.access_token) {
            setErrorText("");
            setFormData({
              email: "",
              password: "",
              confirmPassword: "",
            });
            navigate("/menu", { replace: true });
          } else {
            setErrorText("Registration failed!");
          }
        })
        .catch((error) => {
          if (!error?.response && error?.request) {
            setErrorText("No response from server!");
          } else if (error.response && error.response?.status === 409) {
            setErrorText(error.response.data.detail);
          } else {
            setErrorText("Registration failed!");
          }
        });
    } catch (err) {
      setErrorText("Registration failed!");
    }
  };

  function handleChange(e: React.ChangeEvent) {
    var element = e.target as HTMLInputElement;
    const name = element.name;
    const value = element.value;
    setFormData((data) => {
      var result = { ...data, [name]: value };
      if (name === "password" && value === "") {
        result["confirmPassword"] = "";
      }
      return result;
    });
    setErrorText("");
  }

  return (
    <div className="m-auto h-full w-full p-6 text-lg">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="m-auto box-border w-full rounded-xl bg-slate-200 px-2 py-6 text-lg shadow-2xl md:w-4/5 md:py-12 lg:w-2/3 xl:w-1/2"
      >
        <div className="mx-4 flex flex-col justify-between space-y-20 md:mx-auto md:w-4/5 md:max-w-lg">
          <div className="flex flex-col justify-between">
            {errorText && (
              <div
                ref={errRef}
                className="mb-4 rounded-lg border-2 border-red-500 bg-red-100 p-2 font-semibold text-red-500 shadow-md lg:text-xl"
              >
                {errorText}
              </div>
            )}
            <label
              htmlFor="email"
              className="py-2 text-xl font-semibold lg:text-2xl"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              className="rounded-lg border-2 border-slate-300 p-2 lg:text-xl"
              onChange={(e) => handleChange(e)}
              required
              autoFocus
            />

            <label
              htmlFor="password"
              className="mt-8 py-2 text-xl font-semibold lg:text-2xl"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              className="rounded-lg border-2 border-slate-300 p-2 lg:text-xl"
              onChange={(e) => handleChange(e)}
              required
            />
            <p className="text-red-500">
              {formData.password.length > 0 && !re.test(formData.password)
                ? "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character [@$!%*?&]"
                : ""}
            </p>
            <label
              htmlFor="confirmPassword"
              className="mt-8 py-2 text-xl font-semibold lg:text-2xl"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              className="rounded-lg border-2 border-slate-300 p-2 lg:text-xl"
              onChange={(e) => handleChange(e)}
              disabled={
                formData.password.length === 0 || !re.test(formData.password)
              }
              required
            />
            <p
              className={
                formData.confirmPassword.length !== 0
                  ? formData.password === formData.confirmPassword
                    ? "text-green-500"
                    : "text-red-500"
                  : ""
              }
            >
              {formData.confirmPassword.length !== 0 &&
                (formData.password === formData.confirmPassword
                  ? ""
                  : "Passwords don't match")}
            </p>
          </div>
          <div className="flex flex-col justify-between space-y-10">
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-t from-amber-400 to-amber-200 px-8 py-4 text-xl font-semibold shadow-lg hover:ring-4 hover:ring-amber-300 hover:ring-offset-2 hover:ring-offset-amber-200 lg:text-2xl"
            >
              Sign up
            </button>
            <p className="text-center lg:text-xl">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 no-underline hover:font-bold hover:text-blue-700"
                replace
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
