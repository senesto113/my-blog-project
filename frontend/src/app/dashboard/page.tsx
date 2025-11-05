"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function DashboardPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) setMessage("Please login or register first.");
  }, []);

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.post("/posts", { title, content });
      setMessage(`Created: ${res.data.title}`);
      setTitle("");
      setContent("");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Create failed");
    }
  }

  async function logout() {
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem("auth_token");
    setMessage("Logged out");
  }

  return (
    <main className="p-8 max-w-xl mx-auto space-y-4">
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-zinc-800 text-white" onClick={logout}>Logout</button>
      </div>
      <h1 className="text-2xl font-semibold">Create Post</h1>
      {message && <p>{message}</p>}
      <form className="space-y-3" onSubmit={createPost}>
        <input className="border p-2 w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="border p-2 w-full h-40" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2" type="submit">Create</button>
      </form>
    </main>
  );
}
