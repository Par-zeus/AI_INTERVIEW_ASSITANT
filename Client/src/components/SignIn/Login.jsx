// src/pages/Login.jsx
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <button className="w-full bg-teal-500 text-white py-2 rounded-lg">Log In</button>
        </form>
        <p className="mt-4 text-center">
          Don’t have an account? <Link to="/signup" className="text-teal-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
