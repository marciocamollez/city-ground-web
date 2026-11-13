<template>
  <main class="home-page">
    <section class="home-intro">
      <p class="eyebrow">CITY GROUND BRASIL</p>
      <h1>Notícias do Nottingham Forest</h1>
      <p class="intro-description">
        Tudo sobre o Forest: notícias, análises, história e muito mais.
      </p>
    </section>

    <!-- Pesquisa e filtros -->
    <section class="filters">
      <input
        v-model="searchInput"
        type="search"
        placeholder="Buscar notícias..."
        aria-label="Buscar artigos"
      />

      <select
        v-model="selectedCategory"
        aria-label="Filtrar por categoria"
      >
        <option value="">Todas as categorias</option>

        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.slug"
        >
          {{ category.name }}
        </option>
      </select>
    </section>

    <!-- Estados da requisição -->
    <div v-if="loading" class="feedback">
      Carregando notícias...
    </div>

    <div v-else-if="error" class="feedback error">
      {{ error }}
    </div>

    <div v-else-if="!posts.length" class="feedback">
      Nenhuma notícia encontrada.
    </div>

    <template v-else>
      <!-- Notícia principal -->
      <section class="featured-section">
        <div class="section-heading">
          <h2>Em destaque</h2>
        </div>

        <article class="featured-post">
          <RouterLink
            :to="`/post/${posts[0].slug}`"
            class="featured-link"
          >
            <div class="featured-image">
              <PostImage
                :src="posts[0].featuredImage"
                :alt="posts[0].title"
                loading="eager"
              />


            </div>

            <div class="featured-info">
              <div class="post-categories">
                <span
                  v-for="category in posts[0].categories"
                  :key="category.id"
                  class="category"
                >
                  {{ category.name }}
                </span>
              </div>

              <h2>{{ posts[0].title }}</h2>

              <time :datetime="posts[0].date">
                {{ formatDate(posts[0].date) }}
              </time>
            </div>
          </RouterLink>
        </article>
      </section>

      <!-- Demais notícias -->
      <section v-if="posts.length > 1" class="latest-section">
        <div class="section-heading">
          <h2>Últimas notícias</h2>
        </div>

        <div class="posts-grid">
          <PostCard
            v-for="post in posts.slice(1)"
            :key="post.id"
            :post="post"
          />
        </div>
      </section>
    </template>

    <!-- Paginação -->
    <nav
      v-if="pagination && !loading && posts.length"
      class="pagination"
      aria-label="Paginação"
    >
      <button
        :disabled="!pagination.hasPrevious"
        @click="changePage(currentPage - 1)"
      >
        ← Anterior
      </button>

      <span>
        Página {{ pagination.page }} de {{ pagination.totalPages }}
      </span>

      <button
        :disabled="!pagination.hasNext"
        @click="changePage(currentPage + 1)"
      >
        Próxima →
      </button>
    </nav>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import PostImage from '../components/PostImage.vue'

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

function formatDate(date: string): string {
  if (!date) return ''

  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
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
    error.value = 'Não foi possível carregar as notícias.'
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

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

/* Introdução */

.home-intro {
  margin-bottom: 32px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #b51e2b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
}

.home-intro h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.intro-description {
  margin: 10px 0 0;
  color: #777;
  font-size: 16px;
}

/* Pesquisa e filtros */

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
}

.filters input,
.filters select {
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 14px;
}

.filters input {
  flex: 1;
  max-width: 400px;
}

.filters select {
  min-width: 190px;
}

/* Títulos das seções */

.section-heading {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #b51e2b;
}

.section-heading h2 {
  margin: 0;
  font-size: 24px;
}

/* Notícia principal */

.featured-section {
  margin-bottom: 48px;
}

.featured-post {
  overflow: hidden;
  border-radius: 10px;
  background: #f7f7f7;
}

.featured-link {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  min-height: 350px;
  color: inherit;
  text-decoration: none;
}

.featured-image {
  position: relative;
  min-height: 350px;
  overflow: hidden;
  background: #b51e2b;
}

.featured-image img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 350px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-post:hover .featured-image img {
  transform: scale(1.03);
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 350px;
  color: white;
  font-weight: 700;
  letter-spacing: 2px;
}

.featured-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px;
}

.post-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.category {
  padding: 5px 9px;
  border-radius: 4px;
  background: #e8f2ec;
  color: #26734d;
  font-size: 12px;
  font-weight: 600;
}

.featured-info h2 {
  margin: 0 0 16px;
  font-size: 30px;
  line-height: 1.25;
  transition: color 0.2s ease;
}

.featured-post:hover .featured-info h2 {
  color: #b51e2b;
}

.featured-info time {
  color: #777;
  font-size: 13px;
}

/* Grade de notícias */

.latest-section {
  margin-bottom: 48px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px 24px;
}

/* Estados */

.feedback {
  padding: 40px 0;
  text-align: center;
  color: #777;
}

.feedback.error {
  color: #b51e2b;
}

/* Paginação */

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 40px;
}

.pagination button {
  padding: 10px 18px;
  border: 1px solid #b51e2b;
  border-radius: 5px;
  background: white;
  color: #b51e2b;
  font-weight: 600;
  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  background: #b51e2b;
  color: white;
}

.pagination button:disabled {
  border-color: #ddd;
  color: #aaa;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
  color: #666;
}

/* Responsividade */

@media (max-width: 900px) {
  .featured-link {
    grid-template-columns: 1fr;
  }

  .featured-image,
  .featured-image img,
  .image-placeholder {
    min-height: 280px;
  }

  .posts-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .home-page {
    padding: 28px 16px 48px;
  }

  .home-intro h1 {
    font-size: 28px;
  }

  .intro-description {
    font-size: 14px;
  }

  .filters {
    flex-direction: column;
    margin-bottom: 32px;
  }

  .filters input,
  .filters select {
    width: 100%;
    max-width: none;
    box-sizing: border-box;
  }

  .featured-image,
  .featured-image img,
  .image-placeholder {
    min-height: 220px;
  }

  .featured-info {
    padding: 20px;
  }

  .featured-info h2 {
    font-size: 23px;
  }

  .posts-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .section-heading h2 {
    font-size: 21px;
  }

  .pagination {
    gap: 10px;
  }

  .pagination button {
    padding: 9px 12px;
  }

  .pagination span {
    font-size: 12px;
  }
}
</style>
