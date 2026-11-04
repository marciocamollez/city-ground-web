<template>
  <main>
    <h1>Home Page</h1>

    <input
      v-model="searchInput"
      type="search"
      placeholder="Buscar artigos..."
      aria-label="Buscar artigos"
    />

    <select v-model="selectedCategory" aria-label="Filtrar por categoria">
      <option value="">Todas as categorias</option>

      <option
        v-for="category in categories"
        :key="category.id"
        :value="category.slug"
      >
        {{ category.name }}
      </option>
    </select>

    <p v-if="loading">Carregando posts...</p>
    <p v-else-if="error">{{ error }}</p>

    <div v-else-if="posts.length">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>

    <p v-else>Nenhum artigo encontrado.</p>

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
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Post } from '../types/post'
import type { Pagination } from '../types/pagination'
import type { Category } from '../types/category'
import { blogService } from '../services/blog.service'
import PostCard from '../components/PostCard.vue'

const route = useRoute()
const router = useRouter()

const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const pagination = ref<Pagination | null>(null)
const perPage = 10

function getPageFromUrl(): number {
  const page = Number(route.query.page)

  return Number.isInteger(page) && page > 0 ? page : 1
}

const currentPage = computed(getPageFromUrl)

const searchInput = ref(
  typeof route.query.search === 'string' ? route.query.search : '',
)

const selectedCategory = ref(
  typeof route.query.categorySlug === 'string'
    ? route.query.categorySlug
    : '',
)

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

async function loadPosts(search?: string, categorySlug?: string) {
  loading.value = true
  error.value = null

  try {
    const result = await blogService.getPosts(
      currentPage.value,
      perPage,
      search,
      categorySlug,
    )

    posts.value = result.items
    pagination.value = result.meta
  } catch {
    error.value = 'Não foi possível carregar os posts.'
    posts.value = []
    pagination.value = null
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    categories.value = await blogService.getCategories()
  } catch (err) {
    console.error('Não foi possível carregar as categorias.', err)
  }
}

// URL -> estado dos campos e carregamento dos artigos.
watch(
  [
    () => route.query.page,
    () => route.query.search,
    () => route.query.categorySlug,
  ],
  () => {
    const search =
      typeof route.query.search === 'string' ? route.query.search : ''

    const categorySlug =
      typeof route.query.categorySlug === 'string'
        ? route.query.categorySlug
        : ''

    searchInput.value = search
    selectedCategory.value = categorySlug

    void loadPosts(search || undefined, categorySlug || undefined)
  },
  { immediate: true },
)

// Campo de busca -> URL, com debounce.
watch(searchInput, (newValue, _oldValue, onCleanup) => {
  const search = newValue.trim()
  const currentSearch =
    typeof route.query.search === 'string' ? route.query.search : ''

  // Evita atualizar a URL quando o campo foi sincronizado a partir dela.
  if (search === currentSearch) {
    return
  }

  const timeout = window.setTimeout(() => {
    void router.replace({
      query: {
        ...route.query,
        page: undefined,
        search: search || undefined,
      },
    })
  }, 400)

  onCleanup(() => {
    window.clearTimeout(timeout)
  })
})

// Categoria selecionada -> URL.
watch(selectedCategory, (categorySlug) => {
  const currentCategory =
    typeof route.query.categorySlug === 'string'
      ? route.query.categorySlug
      : ''

  // Evita navegação redundante quando o valor veio da própria URL.
  if (categorySlug === currentCategory) {
    return
  }

  void router.push({
    query: {
      ...route.query,
      page: undefined,
      categorySlug: categorySlug || undefined,
    },
  })
})

void loadCategories()
</script>
