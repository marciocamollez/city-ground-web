
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { blogService } from '../../services/blog.service'
import type { Category } from '../../types/category'

const categories = ref<Category[]>([])
const loading = ref(false)

const route = useRoute()

const isHomeActive = computed(() => {
  return route.path === '/' && !route.query.categorySlug
})

function isCategoryActive(slug: string) {
  return route.path === '/' && route.query.categorySlug === slug
}

async function loadCategories() {
  loading.value = true

  try {
    categories.value = await blogService.getCategories()
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <RouterLink to="/" class="brand">
        <span class="brand-name">CITY GROUND</span>
        <span class="brand-country">BRASIL</span>
      </RouterLink>

      <nav class="main-navigation">
        <RouterLink to="/" class="nav-link" :class="{ active: isHomeActive }">
          Início
        </RouterLink>

        <RouterLink
          v-for="category in categories"
          :key="category.id"
          :to="{
            path: '/',
            query: { categorySlug: category.slug },
          }"
          class="nav-link"
          :class="{ active: isCategoryActive(category.slug) }"
        >
          {{ category.name }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eaeaea;
}

.header-container {
  max-width: 1200px;
  min-height: 90px;
  margin: 0 auto;
  padding: 16px 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  text-decoration: none;
  line-height: 1;
}

.brand-name {
  color: #b51e2b;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -1px;
}

.brand-country {
  margin-top: 5px;
  color: #b51e2b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 5px;
}

.main-navigation {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 24px;
}

.nav-link {
  color: #333;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #b51e2b;
}

.nav-link.active {
  position: relative;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 100%;
  height: 2px;
  background: #b51e2b;
}

@media (max-width: 700px) {
  .header-container {
    align-items: flex-start;
    flex-direction: column;
    min-height: auto;
  }

  .main-navigation {
    justify-content: flex-start;
    gap: 16px;
  }
}
</style>
