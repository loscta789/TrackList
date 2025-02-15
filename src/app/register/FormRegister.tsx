"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../services/auth";

export default function FormRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  
  const handleSubmit = async (e) => {
    console.log("in")
    e.preventDefault();

    try {
      const data = await registerUser(username, email, password);
      alert("Registration successful!");
    } catch (error) {
      alert(error.message || "An error occurred.");
    }
  };



  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Séparateur */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="text-gray-400 px-4">Create an account</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4 mr-2 ml-2 ">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        
        {/* Bouton REGISTER */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
        >
          REGISTER
        </button>
      </form>

      {/* Séparateur */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="text-gray-400 px-4">OR</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>

      {/* Bouton LOGIN */}
      <button
        className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition"
        onClick={() => router.push("/login")}
      >
        LOG IN
      </button>
    </div>
  );
}
