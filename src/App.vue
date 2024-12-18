<template>
  <login/>
  <home/>
</template>

<script>
import login from './components/login.vue'
import home from './components/home.vue'

export default {
  name: 'App',
  components: {
    login,
    home
  }
}
</script>

