<template>
  <main>
    <RouterLink :to="{ name: 'Home' }">
      ← Voltar para a Home
    </RouterLink>

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
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { Post } from '../types/post'
import { blogService } from '../services/blog.service'

const route = useRoute()

const post = ref<Post | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

watch(
  () => route.params.slug,
  async (slug) => {
    if (typeof slug !== 'string') {
      error.value = 'Slug inválido.'
      post.value = null
      loading.value = false
      return
    }

    loading.value = true
    error.value = null
    post.value = null

    try {
      post.value = await blogService.getPostBySlug(slug)
    } catch {
      error.value = 'Não foi possível carregar o artigo.'
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>
