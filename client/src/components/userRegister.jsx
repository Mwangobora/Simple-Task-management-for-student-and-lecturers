import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'student',
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is not valid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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

        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage(`Welcome ${data.username}, your registration was successful!`);
                setFormData({ username: '', email: '', password: '', role: 'user' });
                setErrors({});
            } else {
                const errorData = await response.json();
                setErrors({ general: errorData.message || 'username or Email already existed' });
            }
        } catch (err) {
            console.error(err);
            setErrors({ general: 'Server error, please try again later' });
        }

        setIsLoading(false);
    };

    return (
        <Fragment>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>
                    <p className="text-center text-gray-500">Create your account</p>
                    {errors.general && (
                        <div className="text-red-500 text-center mb-4">{errors.general}</div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>

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

                        {/* Role Field */}
                        <div>
                            <label htmlFor="role" className="block text-gray-700">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                 <option value="student">Student</option>
                                 <option value="lecturer">Lecturer</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                            >
                                {isLoading ? 'Submitting...' : 'Register'}
                            </button>
                        </div>
                    </form>

                    {/* Success Message */}
                   {successMessage && (
    <div className="text-green-500 text-center mt-4">
        {successMessage}
        <Link to="/sign-in" className="text-blue-500 hover:underline ml-2">
            login
        </Link>
    </div>
)}

                </div>
            </div>
        </Fragment>
    );
};

export default RegisterForm;
