<template>
  <v-app-bar :elevation="2" color="surface" height="80">
    <v-container class="d-flex align-center px-4 navbar-container">
      <!-- Desktop Menu -->
      <div class="nav-links d-none d-md-flex">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
        >
          {{ link.title }}
        </router-link>
      </div>

      <!-- Mobile Menu -->
      <v-app-bar-nav-icon
        class="d-md-none"
        @click="drawer = !drawer"
      />

      <router-link to="/" class="logo-link">
        <div class="logo-container">
          <v-icon icon="mdi-compass" size="40" color="primary" />
          <span class="logo-text">סולתרפיה</span>
        </div>
      </router-link>
    </v-container>
  </v-app-bar>

  <!-- Mobile Drawer -->
  <v-navigation-drawer v-model="drawer" location="start" temporary>
    <v-list>
      <v-list-item
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        @click="drawer = false"
      >
        <v-list-item-title>{{ link.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)

const navLinks = [
  { title: 'בית', path: '/' },
  { title: 'מהי סולתרפיה', path: '/what-is-soltherapy' },
  { title: 'חברת סקרנות ולמידה', path: '/groups' },
  { title: 'אודות משה יצחק', path: '/about' },
  { title: 'יצירת קשר', path: '/contact' },
]
</script>

<style scoped>
.navbar-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse !important;
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.nav-links {
  gap: 32px;
  align-items: center;
  flex-direction: row-reverse;
}

.nav-link {
  text-decoration: none;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
  padding: 4px 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 2px;
  background-color: rgb(var(--v-theme-primary));
  transition: width 0.3s;
}

.nav-link:hover {
  color: rgb(var(--v-theme-primary));
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.router-link-active {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.nav-link.router-link-active::after {
  width: 100%;
}
</style>

