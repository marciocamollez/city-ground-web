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

    <nav v-if="pagination" aria-label="Paginação">
      <button
        :disabled="!pagination.hasPrevious || loading"
        @click="changePage(currentPage - 1)"
      >
        Anterior
      </button>

      <span>
        Página {{ pagination.page }} de {{ pagination.totalPages }}
      </span>

      <button
        :disabled="!pagination.hasNext || loading"
        @click="changePage(currentPage + 1)"
      >
        Próxima
      </button>
    </nav>

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Post } from '../types/post';
import type { Pagination } from '../types/pagination';
import { blogService } from '../services/blog.service';
import PostCard from '../components/PostCard.vue';

const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const pagination = ref<Pagination | null>(null);
const perPage = 10;

function changePage(page: number) {
  if (page < 1 || page === currentPage.value) {
    return
  }

  currentPage.value = page
  loadPosts()
}

async function loadPosts() {
  loading.value = true
  error.value = null

  try {
    const result = await blogService.getPosts(
      currentPage.value,
      perPage,
    )

    posts.value = result.items
    pagination.value = result.meta
  } catch {
    error.value = 'Não foi possível carregar os posts.'
  } finally {
    loading.value = false
  }
}

onMounted(loadPosts)
</script>
