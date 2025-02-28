import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navigation = () => {
    return (
        <Fragment>
            <nav className="bg-gray-600 text-white px-4 py-3"> {/* Changed background color */}
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold">
                        <Link to="/" className="hover:text-yellow-300">CarRental</Link>
                    </div>
                    <div className="hidden md:flex space-x-6">
                        <Link to="/" className="hover:text-yellow-300">Home</Link>
                      
                        <Link to="/cars" className="hover:text-yellow-300">Cars</Link>
                        <Link to="/sign in" className="hover:text-yellow-300">Sign In</Link>
                        <Link to="/" className="hover:text-yellow-300">Help</Link>
                    </div>
                    <button className="md:hidden text-yellow-300 focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
            </nav>
        </Fragment>
    );
};

export default Navigation;
