import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorText, setErrorText] = useState("");
  const errRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      AuthService.login(formData.email, formData.password)
        .then((response) => {
          if (response?.data?.access_token) {
            setErrorText("");
            setFormData({ email: "", password: "" });
            navigate("/menu", { replace: true });
          } else {
            setErrorText("Login failed");
          }
        })
        .catch((error) => {
          if (!error?.response && error?.request) {
            setErrorText("No response from server");
          } else if (error.response && error.response?.status === 403) {
            setErrorText(error.response.data.detail);
          } else {
            setErrorText("Login failed");
          }
        });
    } catch (error) {
      setErrorText("Login failed");
    }
  };

  function handleChange(e: React.ChangeEvent) {
    var element = e.target as HTMLInputElement;
    const name = element.name;
    const value = element.value;
    setFormData((data) => ({ ...data, [name]: value }));
    setErrorText("");
  }

  return (
    <div className="m-auto h-full w-full bg-slate-400 p-6 text-lg">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="m-auto box-border w-full rounded-xl bg-slate-200 px-2 py-6 text-lg md:w-4/5 md:py-12 lg:w-2/3 xl:w-1/2"
      >
        <div className="mx-4 flex flex-col justify-between space-y-20 md:mx-auto md:w-4/5 md:max-w-lg">
          <div className="flex flex-col justify-between">
            {errorText && (
              <div
                ref={errRef}
                className="mb-4 rounded-lg border-2 border-red-500 bg-red-100 p-2 font-semibold text-red-500 shadow-md"
              >
                {errorText}!
              </div>
            )}
            <label htmlFor="email" className="py-2 text-xl font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              className="rounded-lg border-2 border-slate-300 p-2 "
              onChange={(e) => handleChange(e)}
              required
            />

            <label
              htmlFor="password"
              className="mt-8 py-2 text-xl font-semibold"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              className="rounded-lg border-2 border-slate-300 p-2"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="flex flex-col justify-between space-y-10">
            <button
              type="submit"
              className="rounded-lg bg-amber-300 px-8 py-4 text-xl font-semibold shadow-lg hover:bg-amber-400"
            >
              Login
            </button>
            <p className="text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 no-underline hover:font-bold hover:text-blue-700"
                replace
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;

// auth
// add username field
