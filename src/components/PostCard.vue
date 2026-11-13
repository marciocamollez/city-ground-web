
<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PostImage from './PostImage.vue'
import type { Post } from '../types/post'

const props = defineProps<{
  post: Post
}>()

const formattedDate = computed(() => {
  if (!props.post.date) return ''

  return new Date(props.post.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
})
</script>

<template>
  <article class="post-card">
    <RouterLink
      :to="`/post/${post.slug}`"
      class="post-link"
    >
      <div class="post-image">
        <PostImage
          :src="post.featuredImage"
          :alt="post.title"
          loading="lazy"
        />


      </div>

      <div class="post-info">
        <div class="post-categories">
          <span
            v-for="category in post.categories"
            :key="category.id"
            class="category"
          >
            {{ category.name }}
          </span>
        </div>

        <h2>{{ post.title }}</h2>

        <time :datetime="post.date">
          {{ formattedDate }}
        </time>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.post-card {
  min-width: 0;
  height: 100%;
}

.post-link {
  display: block;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.post-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;
  background: #eee;
}


.post-card:hover .post-image img {
  transform: scale(1.04);
}


.post-info {
  padding-top: 14px;
}

.post-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.category {
  padding: 4px 8px;
  border-radius: 4px;
  background: #e8f2ec;
  color: #26734d;
  font-size: 12px;
  font-weight: 600;
}

.post-info h2 {
  margin: 0 0 10px;
  font-size: 20px;
  line-height: 1.3;
  transition: color 0.2s ease;
}

.post-card:hover h2 {
  color: #b51e2b;
}

.post-info time {
  color: #777;
  font-size: 13px;
}
</style>
