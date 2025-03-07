"use client";

import { useState } from "react";
import { NextPage } from "next";
import Swal from "sweetalert2";
import customerJSON from "~~/data/customer.json";
import { CustomerInterface, CustomerWithoutPasswordInterface } from "~~/interfaces/GeneralInterface";

const Register: NextPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // check if user is already logged in
  if (typeof window !== "undefined" && (localStorage.getItem("employeeData") || localStorage.getItem("customerData"))) {
    Swal.fire({
      title: "Loading...",
      html: "Please wait while we redirect you to the home page.",
      timer: 1500,
      timerProgressBar: true,
      /*************  ✨ Codeium Command ⭐  *************/
      /**
       * This function is triggered when the Swal modal is opened.
       * It displays a loading spinner to indicate that a process is ongoing.
       */

      /******  0b865a71-d370-4ae0-a613-ebf55e513c95  *******/
      didOpen: () => {
        Swal.showLoading();
      },
    }).then(() => {
      window.location.href = "/";
    });
  }

  const handleSubmit = async () => {
    // check if empty
    if (email === "" || password === "" || confirmPassword === "") {
      Swal.fire({
        icon: "error",
        title: "Please fill in all fields.",
        text: "Please try again.",
      });
      console.error("Please fill in all fields.");
      return;
    }

    // check if password match
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match.",
        text: "Please try again.",
      });
      console.error("Passwords do not match.");
      return;
    }

    // check if user exists
    const customer = customerJSON.find(u => u.email === email && u.password === password);
    if (customer) {
      Swal.fire({
        icon: "error",
        title: "User already exists.",
        text: "Please try again.",
      });
      console.error("User already exists.");
      return;
    }

    // register user
    const newUser: CustomerInterface = {
      name,
      email,
      password,
    };

    async function registerUser(newUser: CustomerInterface) {
      if (!newUser) {
        return;
      }

      try {
        const updatedCustomerJSON = [...customerJSON, newUser];
        const response = await fetch("/api/customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCustomerJSON),
        });

        if (!response.ok) throw new Error("Failed to register user");
      } catch (error) {
        console.error(error);
      }
    }

    await registerUser(newUser);

    Swal.fire({
      icon: "success",
      title: "Registration successful!",
      text: "Welcome!",
    }).then(() => {
      window.location.href = "/login";
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Register Page</h1>
      <p>Register your account here.</p>

      {/* Register window */}
      <div className="flex flex-col w-[30%] min-w-96 gap-2 mb-4">
        <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend">Register</legend>

          <label className="fieldset-label">Name</label>
          <input
            type="text"
            className="input w-full"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label className="fieldset-label">Email</label>
          <input
            type="email"
            className="input w-full"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label className="fieldset-label">Password</label>
          <input
            type="password"
            className="input w-full"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <label className="fieldset-label">Confirm Password</label>
          <input
            type="password"
            className="input w-full"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <button className="btn btn-primary mt-4" type="submit" onClick={handleSubmit}>
            Register
          </button>
        </fieldset>
      </div>
    </div>
  );
};

export default Register;
