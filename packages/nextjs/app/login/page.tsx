"use client";

import { useState } from "react";
import employeeJSON from "../../public/data/employee.json";
import { NextPage } from "next";
import Swal from "sweetalert2";

const Login: NextPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    // check if empty
    if (username === "" || password === "") {
      Swal.fire({
        icon: "error",
        title: "Please fill in all fields.",
        text: "Please try again.",
      });
      console.error("Please fill in all fields.");
      return;
    }

    // check if user exists
    const user = employeeJSON.find(u => u.email === username && u.password === password);
    if (user) {
      Swal.fire({
        icon: "success",
        title: "Login successful!",
        text: "Welcome back!",
      }).then(() => {
        const { password, ...userWithoutPassword } = user;
        const userString = JSON.stringify(userWithoutPassword);
        const userBase64 = btoa(userString);
        localStorage.setItem("loginData", userBase64);
        window.location.href = "/";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid username or password.",
        text: "Please try again.",
      });
      console.error("Invalid username or password.");
      return;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Login Page</h1>
      <p>Login to your account here.</p>

      {/* Login window */}
      <div className="flex flex-col w-[30%] min-w-96 gap-2 mb-4">
        <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">Login</legend>

          <label className="fieldset-label">Email</label>
          <input
            type="email"
            className="input w-full"
            placeholder="Email"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />

          <label className="fieldset-label">Password</label>
          <input
            type="password"
            className="input w-full"
            placeholder="Password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />

          <button className="btn btn-primary mt-4" type="submit" onClick={handleSubmit}>
            Login
          </button>
        </fieldset>
      </div>
    </div>
  );
};

export default Login;
