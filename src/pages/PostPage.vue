<template>
  <main>
    <p v-if="loading">Carregando artigo...</p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <article v-else-if="post">
      <h1>{{ post.title }}</h1>
      <p>{{ post.excerpt }}</p>
    </article>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Post } from '../types/post'
import { blogService } from '../services/blog.service'

const route = useRoute()

const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    post.value = await blogService.getPostBySlug(slug)
  } catch {
    error.value = 'Não foi possível carregar o artigo.'
  } finally {
    loading.value = false
  }
})
</script>
