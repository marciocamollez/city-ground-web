<template>
  <main>
    <h1>Home Page</h1>

    <p v-if="loading">Carregando posts...</p>
    <p v-else-if="error">{{ error }}</p>

    <div v-else>
      <PostCard
        v-for="post in posts"
        :post="post"
        :key="post.id"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Post } from '../types/post';
import { blogService } from '../services/blog.service';
import PostCard from '../components/PostCard.vue';

const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const result = await blogService.getPosts(1, 10);
    posts.value = result.items;
  } catch (err) {
    error.value = 'Erro ao carregar posts';
  } finally {
    loading.value = false;
  }
});


</script>
