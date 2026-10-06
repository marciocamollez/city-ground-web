<template>
  <h1>Post Page</h1>
  <p>Slug: {{ slug }}</p>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const slug = route.params.slug as string
</script>
