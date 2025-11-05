<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with('user:id,name')
            ->latest('published_at')
            ->latest('created_at')
            ->paginate(10);

        return response()->json($posts);
    }

    public function show(Post $post)
    {
        $post->load('user:id,name');
        return response()->json($post);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug'],
            'content' => ['required', 'string'],
            'published_at' => ['nullable', 'date'],
        ]);

        $user = $request->user();

        $slug = $validated['slug'] ?? Str::slug($validated['title']);
        if (Post::where('slug', $slug)->exists()) {
            $slug = Str::slug($validated['title'] . '-' . Str::random(6));
        }

        $post = Post::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $validated['content'],
            'published_at' => $validated['published_at'] ?? null,
            'user_id' => $user->id,
        ]);

        return response()->json($post, 201);
    }

    public function update(Request $request, Post $post)
    {
        $this->authorizeOwner($request->user()->id, $post->user_id);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', 'unique:posts,slug,' . $post->id],
            'content' => ['sometimes', 'string'],
            'published_at' => ['sometimes', 'nullable', 'date'],
        ]);

        if (isset($validated['title']) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $post->update($validated);

        return response()->json($post);
    }

    public function destroy(Request $request, Post $post)
    {
        $this->authorizeOwner($request->user()->id, $post->user_id);
        $post->delete();
        return response()->json(['message' => 'Post deleted']);
    }

    private function authorizeOwner(int $authUserId, int $resourceUserId): void
    {
        abort_if($authUserId !== $resourceUserId, 403, 'Forbidden');
    }
}


