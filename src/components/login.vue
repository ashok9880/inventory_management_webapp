<template>
  <div class="flex justify-center items-center min-h-screen bg-gradient-to-r from-slate-200 to-slate-300">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-center text-blue-500 mb-6">Login</h1>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">Username</label>
          <input id="username" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="username" placeholder="Enter your username" autocomplete="off" required/>
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-2">Password</label>
          <input id="password" type="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="password" placeholder="Enter your password" required/>
        </div>

        <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Log In</button>
      </form>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login(e) {
      e.preventDefault()

      try {
        const response = await axios.get("http://localhost:3000/users")
        const user = response.data.find((u) => u.username === this.username && u.password === this.password)

        console.log(user, "user")
      }
      catch (err) {
        console.error(err)
      }

    },
  },
};
</script>

