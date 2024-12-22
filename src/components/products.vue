<template>
  <navBar/>
  
  <div class="p-4">
     <div class="grid grid-cols-3 my-4">
        <div class="">
          <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" v-model="search" placeholder="Search" autocomplete="off" required/>
        </div>   

        <div v-if="loggedUserData.designation == 'MANAGER'" class="col-start-3 text-right">            
            <button class="btn-sm bg-[#00416ada] text-white" @click="createProduct()"><span class="material-icons mi-sm">add</span> New Product</button>
        </div>
    </div>

    <!-- table -->
    <table class="table-striped table-bordered bg-white">
        <thead class="sticky -top-4 z-10 bg-white">
            <tr class="text-[#00416ada]">
              <th>#</th>
              <th class="cursor-pointer" @click="sortTable('name')">Product Name<span class="material-icons mi-md ml-1">{{ getSortIcon('name') }}</span></th>
              <th class="cursor-pointer" @click="sortTable('price')">Price<span class="material-icons mi-md ml-1">{{ getSortIcon('price') }}</span></th>
              <th class="cursor-pointer" @click="sortTable('stock')">Current Stock<span class="material-icons mi-md ml-1">{{ getSortIcon('stock') }}</span></th>
              <th class="cursor-pointer" @click="sortTable('date_added')">Date Added<span class="material-icons mi-md ml-1">{{ getSortIcon('date_added') }}</span></th>
              <th v-if="loggedUserData.designation == 'MANAGER'" class="w-36">Actions</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(product, idx) in filteredProducts" :key="product.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.stock }}</td>
              <td>{{ product.date_added }}</td>
              <td v-if="loggedUserData.designation == 'MANAGER'" class="w-36 text-center">
                <button type="button" class="text-sm btn-sm bg-orange-500 text-white" @click="editProduct(product)"><span class="material-icons mi-sm">edit</span></button>
                <button type="button" class="text-sm btn-sm bg-red-500 text-white" @click="deleteProduct(product)"><span class="material-icons mi-sm">delete</span></button>
              </td>
            </tr>
           
        </tbody>
    </table>
  </div>

  <!--Modal-->
  <form @submit.prevent="saveProduct">
    <Modal :isOpen="isModalOpen" :widthClass="modalWidth">
      <template #header>
      <h3 class="text-lg font-semibold" v-if="addMode == 'EDIT'">Edit - {{ newProduct.name }}</h3>
      <h3 class="text-lg font-semibold" v-else>New Product</h3>
      <button @click="closeModal" class="text-white hover:text-gray-200"><span class="material-icons">close</span></button>
      </template>

      <template #body>
          <label class="block mb-2">Product Name</label>
          <input v-model="newProduct.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" required/>

          <label class="block mb-2 mt-4">Price</label>
          <input v-model="newProduct.price" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" required/>

          <label class="block mb-2 mt-4">Current Stock</label>
          <input v-model="newProduct.stock" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" required/>
          
          <label class="block mb-2 mt-4">Date</label>
          <input v-model="newProduct.date_added" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" required/>

      </template>

      <template #footer>
        <button @click="closeModal" type="button" class="btn-md bg-gray-300 text-gray-700 hover:bg-gray-400">Cancel</button>
        <button type="submit" class="btn-md bg-[#00416ada] text-white">Save</button>
      </template>
    </Modal>
  </form>
   
</template>

<script>
import navBar from './navBar.vue'
import axios from "axios";
import Modal from "./ModalComponent.vue";
import Swal from 'sweetalert2';

export default {
  name: "ProductsPage",
  components: {
    navBar,
    Modal,
  },

  data() {
    return {
      isModalOpen: false,
      modalWidth: 'w-1/3',
      addMode: 'ADD',
      newProduct: {},
      search: '',
      sort: 'name',
      sortOrder: 'asc',  
      products: [],
      loggedUserData: {}
    };
  },
  mounted() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    if (!loggedInUser) {
      this.$router.push({name: 'LoginPage'})
    }
    else {
        this.loggedUserData = loggedInUser
    }

    this.getProducts()
  },
  computed: {                 
    filteredProducts() {
        let fltrProducts = []  
        let searchText = this.search.toLowerCase().split(' ').join('')

        //Sort
        let sorted = this.sortedProducts(this.products)
        sorted.forEach(item => {
            if (item.name.toLowerCase().split(' ').join('').includes(searchText))
            {
              fltrProducts.push(item)
            }     
        })
        return fltrProducts
    },
  },
  methods: {
    async getProducts() {
      try {
        const response = await axios.get("http://localhost:3000/products")
        this.products = response.data
      } catch (err) {
        console.error(err)
      }
    },
    sortTable(newSort) {
        if (newSort == this.sort)
        {
            this.sortOrder = (this.sortOrder === "asc") ? "desc" : "asc"
        }
        else
        {
            this.sort = newSort
            this.sortOrder = "asc"
        }
    },
    sortedProducts(list) {
        let array = [...list]

        return array.sort((a, b) => {
            let a1 = a[`${this.sort}`].toString().toLowerCase()
            let b1 = b[`${this.sort}`].toString().toLowerCase()

            if (this.sortOrder == "asc") {
                return a1.localeCompare(b1, 'en', { numeric: true })
            }
            else {
                return b1.localeCompare(a1, 'en', { numeric: true })
            }
        })                     
    },
    getSortIcon(field) {
      if (this.sort === field) {
        return this.sortOrder === "asc" ? "expand_less" : "expand_more";
      }
      return "unfold_more";
    },
    openModal() {
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
    },
    createProduct() {
      this.addMode = "ADD"
      this.newProduct = {}
      this.openModal()
    },
    editProduct(item){
      this.newProduct = JSON.parse(JSON.stringify(item))
      this.addMode = "EDIT"
      this.openModal()
    },
    async saveProduct(e) {
      e.preventDefault()

      if (this.addMode === "ADD") {
        try {
          await axios.post("http://localhost:3000/products", this.newProduct)
          this.closeModal()
          this.getProducts()
        } catch (err) {
          console.error(err)
        }
      } 
      else if (this.addMode === "EDIT") {
        try {
          await axios.put(`http://localhost:3000/products/${this.newProduct.id}`, this.newProduct)
          this.closeModal()
          this.getProducts()
        } catch (err) {
          console.error(err)
        }
      }
    },
    async deleteProduct(item) {
      const result = await Swal.fire({
        title: `Are you sure you want to delete the product "${item.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#898989',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/products/${item.id}`)
          this.getProducts()
        } catch (err) {
          console.error(err)
        }
      }
             
    }
  },
};
</script>
   