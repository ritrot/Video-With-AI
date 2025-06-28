"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const route = useRouter();
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (password != confirmPassword) {
                setError("Passwords do not match");
            }
            const data = await fetch("api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            )

            if (!data.ok) {
                setError("Registration failed");
            } else {
                route.push("/login");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setError("An error occurred during registration. Please try again.");
        }
    }
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword} onChange
                    ={(e) => setConfirmPassword(e.target.value)}
                    required />
                <button type="submit">Register</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>

        </div>
    )
}

export default page
