<template>
  <nav class="bg-blue-600 text-white p-4">
    <div class="flex justify-between items-center">
      <label class="text-xl font-bold hover:text-gray-200">Inventory App</label>
      
      <!-- Navigation Links -->
      <ul class="flex space-x-6">
        <li>
          <router-link to="/manager" class="hover:text-gray-200">Manager Dashboard</router-link>
        </li>
        <li>
          <router-link to="/billperson" class="hover:text-gray-200">Billing Dashboard</router-link>
        </li>
        <li>
          <button @click="logout" class="hover:text-gray-200">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navBar",
  data() {
    return {
      
    };
  },
  methods: {
    
  },
};
</script>
   