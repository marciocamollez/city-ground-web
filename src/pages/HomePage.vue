<template>
  <main>
  <h1>Home Page</h1>

    <article v-for="post in posts" :key="post.id">
      <h2>{{ post.title }}</h2>
      <p>{{ post.slug }}</p>
    </article>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Post } from '../types/post';
import { blogService } from '../services/blog.service';

const posts = ref<Post[]>([]);

onMounted(async () => {
  const result = await blogService.getPosts(1, 10);

  posts.value = result.items
});

</script>
