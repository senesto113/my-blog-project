"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/register", { name, email, password });
      localStorage.setItem("auth_token", res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Register failed");
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Register</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="border p-2 w-full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2" type="submit">Register</button>
      </form>
    </main>
  );
}
