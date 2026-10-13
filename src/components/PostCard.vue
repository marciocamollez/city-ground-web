<script setup lang="ts">
import type { Post } from '../types/post'
import { RouterLink } from 'vue-router'

defineProps<{
  post: Post
}>()
</script>

<template>
  <article>
    <h2>{{ post.title }}</h2>
    <p>{{ post.slug }}</p>

    <RouterLink :to="{ name: 'Post', params: { slug: post.slug } }">Ler artigo</RouterLink>
  </article>
</template>
