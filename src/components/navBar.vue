<template>
  <nav class="bg-[#00416ada] text-white p-4">
    <div class="flex justify-between items-center">

      <div class="flex flex-row space-x-6 items-center">
        <label class="text-xl font-bold">Inventory</label>
      
        <!-- Navigation Links -->
        <router-link to="/products" class="hover:font-semibold" active-class="bg-white text-[#00416ada] font-semibold px-2 py-0.5 rounded-md">Products</router-link>
        <router-link to="/bills" class="hover:font-semibold" active-class="bg-white text-[#00416ada] font-semibold px-2 py-0.5 rounded-md">Bills</router-link>
        <router-link to="/users" v-if="loggedUserData.designation == 'MANAGER'" class="hover:font-semibold" active-class="bg-white text-[#00416ada] font-semibold px-2 py-0.5 rounded-md">Users</router-link>
      </div>

      <div>
        <span class="material-icons mi-sm px-2">account_circle</span>
        <label>{{ loggedUserData.username }} - {{ loggedUserData.designation }}</label>
        <button @click="logout" class="hover:font-semibold pl-8"><span class="material-icons mi-sm">logout</span> Logout</button>
      </div>
      
    </div>
  </nav>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: "navBar",
  data() {
    return {
      loggedUserData: {}
    };
  },
  mounted() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
      this.loggedUserData = loggedInUser
    }
  },
  methods: {
    async logout() {
      const result = await Swal.fire({
        title: "Are you sure you want to logout ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#898989',
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        localStorage.clear();
        this.$router.push({name: 'LoginPage'})
      }
      
    },
  },
};
</script>
   