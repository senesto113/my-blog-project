"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "../lib/api";

type Post = { id: number; title: string; slug: string; user_id: number };

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts")
      .then((res) => {
        const items = res.data.data ?? res.data;
        setPosts(items);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <main className="p-8 space-y-4">
      <div className="flex gap-4">
        <Link className="underline" href="/login">
          Login
        </Link>
        <Link className="underline" href="/register">
          Register
        </Link>
        <Link className="underline" href="/dashboard">
          Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-semibold">Posts</h1>
      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.id}>
            <Link className="text-blue-600 underline" href={`/posts/${p.id}`}>
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}