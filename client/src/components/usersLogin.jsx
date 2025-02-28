import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = ({ setUserRole }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is not valid";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            var result = await response.json();
            const data = result.user;
            

            if (response.ok) {
                localStorage.setItem("userRole", data.role); 
                setUserRole(data.role); 

                setSuccessMessage(`Welcome back, ${data.username}! Redirecting...`);

                setTimeout(() => {
                    if (data.role === "student") {
                        navigate("/student-dashboard");
                    } else if (data.role === "lecturer") {
                        navigate("/lecturer-dashboard");
                    }
                }, 1000);
                
            } else {
                setErrorMessage(data.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Login failed try again with correct credentials.");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
                <p className="text-center text-gray-500">Sign in to your account</p>

                {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
                {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ${
                                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                            }`}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                {/* Link to Register */}
                <div className="text-center text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
