
<script setup lang="ts">
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <RouterLink to="/" class="brand">
          <span class="brand-name">CITY GROUND</span>
          <span class="brand-country">BRASIL</span>
        </RouterLink>

        <p>
          Um blog dedicado ao Nottingham Forest.
          Notícias, análises, história e tudo sobre
          o clube mais tradicional de Nottingham.
        </p>
      </div>

      <div class="footer-navigation">
        <h3>Navegação</h3>

        <RouterLink to="/">Início</RouterLink>
      </div>
    </div>

    <div class="footer-bottom">
      <p>
        © {{ currentYear }} City Ground Brasil.
        Todos os direitos reservados.
      </p>

      <span>COYR!</span>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 64px;
  background: #222;
  color: #fff;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;

  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 48px;
}

.brand {
  display: inline-flex;
  flex-direction: column;
  text-decoration: none;
  line-height: 1;
}

.brand-name {
  color: #fff;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -1px;
}

.brand-country {
  margin-top: 5px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 5px;
}

.footer-brand p {
  max-width: 400px;
  margin-top: 20px;
  color: #ccc;
  font-size: 14px;
  line-height: 1.7;
}

.footer-navigation {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-navigation h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.footer-navigation a {
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
}

.footer-navigation a:hover {
  color: #fff;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  border-top: 1px solid #444;
  color: #aaa;
  font-size: 12px;
}

.footer-bottom p {
  margin: 0;
}

.footer-bottom span {
  color: #fff;
  font-weight: 600;
}

@media (max-width: 600px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 36px 20px;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }
}
</style>
