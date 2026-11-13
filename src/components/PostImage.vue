
<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string | null
    alt: string
    loading?: 'lazy' | 'eager'
  }>(),
  {
    loading: 'lazy',
  },
)
</script>

<template>
  <div class="post-image-content">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      :loading="loading"
    />

    <div v-else class="image-placeholder">
      <div class="placeholder-decoration decoration-one"></div>
      <div class="placeholder-decoration decoration-two"></div>

      <div class="placeholder-content">
        <span class="placeholder-symbol">CG</span>
        <span class="placeholder-name">CITY GROUND</span>
        <span class="placeholder-country">B R A S I L</span>

        <span class="placeholder-divider"></span>

        <span class="placeholder-description">
          NOTTINGHAM FOREST
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-image-content {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.post-image-content img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-image-content:hover img {
  transform: scale(1.04);
}

.image-placeholder {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #921326, #bd2437);
}

.placeholder-decoration {
  position: absolute;
  width: 260px;
  height: 260px;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 50%;
}

.decoration-one {
  top: -150px;
  left: -100px;
}

.decoration-two {
  right: -140px;
  bottom: -170px;
  width: 350px;
  height: 350px;
}

.placeholder-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.placeholder-symbol {
  margin-bottom: 12px;
  font-family: Georgia, serif;
  font-size: 38px;
  font-weight: bold;
}

.placeholder-name {
  font-family: Georgia, serif;
  font-size: 19px;
  font-weight: bold;
  letter-spacing: 2px;
}

.placeholder-country {
  margin-top: 5px;
  font-size: 10px;
  font-weight: bold;
}

.placeholder-divider {
  width: 45px;
  height: 2px;
  margin: 18px 0;
  background: rgb(255 255 255 / 65%);
}

.placeholder-description {
  font-size: 9px;
  letter-spacing: 2px;
}
</style>
