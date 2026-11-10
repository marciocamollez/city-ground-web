<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import DOMPurify from 'dompurify'

import { blogService } from '../services/blog.service'
import type { Post } from '../types/post'

const route = useRoute()

const post = ref<Post | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const sanitizedContent = computed(() => {
  if (!post.value) return ''

  return DOMPurify.sanitize(post.value.content)
})

const formattedDate = computed(() => {
  if (!post.value?.date) return ''

  return new Date(post.value.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
})

async function loadPost(slug: string) {
  loading.value = true
  error.value = null
  post.value = null

  try {
    post.value = await blogService.getPostBySlug(slug)
  } catch {
    error.value = 'Não foi possível carregar a notícia.'
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug === 'string') {
      loadPost(slug)
    }
  },
  { immediate: true },
)
</script>

<template>
  <article class="post-page">
    <RouterLink to="/" class="back-link">
      ← Voltar para notícias
    </RouterLink>

    <p v-if="loading">Carregando notícia...</p>

    <p v-else-if="error">{{ error }}</p>

    <template v-else-if="post">
      <img
        v-if="post.featuredImage"
        :src="post.featuredImage"
        :alt="post.title"
        class="post-cover"
      />

      <header class="post-header">
        <div class="post-categories">
          <span
            v-for="category in post.categories"
            :key="category.id"
            class="category"
          >
            {{ category.name }}
          </span>
        </div>

        <h1>{{ post.title }}</h1>

        <time :datetime="post.date">
          {{ formattedDate }}
        </time>
      </header>

      <div
        class="post-content"
        v-html="sanitizedContent"
      />
    </template>
  </article>
</template>

<style scoped>
.post-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;
}

.back-link {
  display: inline-block;
  margin-bottom: 24px;
  color: #26734d;
  text-decoration: none;
}

.post-cover {
  display: block;
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 28px;
}

.post-header {
  margin-bottom: 32px;
}

.post-categories {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.category {
  padding: 5px 10px;
  border-radius: 4px;
  background: #e8f2ec;
  color: #26734d;
  font-size: 13px;
}

.post-header h1 {
  margin: 0 0 16px;
  font-size: 36px;
  line-height: 1.2;
}

.post-header time {
  color: #777;
  font-size: 14px;
}

.post-content {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
}

.post-content :deep(p) {
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  .post-header h1 {
    font-size: 28px;
  }

  .post-content {
    font-size: 16px;
  }
}
</style>
