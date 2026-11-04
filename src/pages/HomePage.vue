<template>
  <main>
    <h1>Home Page</h1>

    <input
      v-model="searchInput"
      type="search"
      placeholder="Buscar artigos..."
      aria-label="Buscar artigos"
    />

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
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Post } from '../types/post';
import type { Pagination } from '../types/pagination';
import { blogService } from '../services/blog.service';
import PostCard from '../components/PostCard.vue';

const route = useRoute();
const router = useRouter();

const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(getPageFromUrl())
const pagination = ref<Pagination | null>(null);
const perPage = 10;

const searchInput = ref(
  typeof route.query.search === 'string'
    ? route.query.search
    : '',
)

function getPageFromUrl(): number {
  const page = Number(route.query.page)

  return Number.isInteger(page) && page > 0 ? page : 1
}

function changePage(page: number) {
  if (page < 1 || page === currentPage.value) {
    return
  }

  router.push({
    query: {
      ...route.query,
      page: page > 1 ? String(page) : undefined,
    },
  })
}

async function loadPosts(search?: string) {
  loading.value = true
  error.value = null

  try {
    const result = await blogService.getPosts(
      currentPage.value,
      perPage,
      search,
    )

    posts.value = result.items
    pagination.value = result.meta
  } catch {
    error.value = 'Não foi possível carregar os posts.'
  } finally {
    loading.value = false
  }
}

watch(
  [
    () => route.query.page,
    () => route.query.search,
  ],
  () => {
    currentPage.value = getPageFromUrl()

    const search =
      typeof route.query.search === 'string'
        ? route.query.search
        : ''

    searchInput.value = search

    loadPosts(search || undefined)
  },
  { immediate: true },
)

watch(searchInput, (newValue, _, onCleanup) => {
  const timeout = window.setTimeout(() => {
    router.replace({
      query: {
        ...route.query,
        page: undefined,
        search: newValue.trim() || undefined,
      },
    })
  }, 400)

  onCleanup(() => {
    window.clearTimeout(timeout)
  })
})
</script>
