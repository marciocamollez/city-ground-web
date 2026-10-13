<script setup lang="ts">
import type { Post } from '../types/post'

defineProps<{
  post: Post
}>()
</script>

<template>
  <article>
    <h2>{{ post.title }}</h2>
    <p>{{ post.slug }}</p>
  </article>
</template>
