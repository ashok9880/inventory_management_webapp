<template>
  <navBar/>
  
  <div class="p-4">
     <div class="grid grid-cols-3 my-4">
        <div class="">
          <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" v-model="search" placeholder="Search" autocomplete="off" required/>
        </div>   

        <div class="col-start-3 text-right">            
            <button class="btn-sm bg-[#00416ada] text-white" @click="createUser()"><span class="material-icons mi-sm">add</span> New User</button>
        </div>
    </div>

    <!-- table -->
    <table class="table-striped table-bordered">
        <thead>
            <tr class="text-[#00416ada]">
              <th>#</th>
              <th class="cursor-pointer" @click="sortTable('username')">User Name<span class="material-icons mi-md ml-1">{{ getSortIcon('username') }}</span></th>
              <th class="cursor-pointer" @click="sortTable('designation')">Designation<span class="material-icons mi-md ml-1">{{ getSortIcon('designation') }}</span></th>
              <th class="w-36">Actions</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(user, idx) in filteredUsers" :key="user.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.designation }}</td>
              <td class="w-36 text-center">
                <button type="button" class="text-sm btn-sm btn-orange" @click="editUser(user)"><span class="material-icons mi-sm">edit</span></button>
                <button type="button" class="text-sm btn-sm btn-red" @click="deleteUser(user)"><span class="material-icons mi-sm">delete</span></button>
              </td>
            </tr>
           
        </tbody>
    </table>
  </div>

  <!--Modal-->
  <form @submit.prevent="saveUser">
    <Modal :isOpen="isModalOpen" :widthClass="modalWidth">
      <template #header>
      <h3 class="text-lg font-semibold" v-if="addMode == 'EDIT'">Edit - {{ newUser.username }}</h3>
      <h3 class="text-lg font-semibold" v-else>New User</h3>
      <button @click="closeModal" class="text-white hover:text-gray-200"><span class="material-icons">close</span></button>
      </template>

      <template #body>
        <label class="block mb-2 mt-4">Username</label>
        <input v-model="newUser.username" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" required/>

        <label class="block mb-2 mt-4">Password</label>
        <input v-model="newUser.password" type="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" required/>

        <!-- <label class="block mb-2 mt-4">Designation</label>
        <input v-model="newUser.designation" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" required/> -->
        
        <select v-model="newUser.designation" class="w-full px-4 py-2 mt-4 cursor-pointer border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" required>
          <option disabled value="">Select Designation</option>
          <option>MANAGER</option>
          <option>STAFF</option>
        </select>

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
  name: "UsersPage",
  components: {
    navBar,
    Modal,
  },

  data() {
    return {
      isModalOpen: false,
      modalWidth: 'w-1/3',
      addMode: 'ADD',
      newUser: {},
      search: '',
      sort: 'username',
      sortOrder: 'asc',  
      users: [],
    };
  },
  mounted() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    if (!loggedInUser) {
      this.$router.push({name: 'LoginPage'})
    }

    this.getUsers()
  },
  computed: {                 
    filteredUsers() {
        let fltrUser = []  
        let searchText = this.search.toLowerCase().split(' ').join('')

        //Sort
        let sorted = this.sortedUser(this.users)
        sorted.forEach(item => {
            if (item.username.toLowerCase().split(' ').join('').includes(searchText))
            {
              fltrUser.push(item)
            }     
        })
        return fltrUser
    },
  },
  methods: {
    async getUsers() {
      try {
        const response = await axios.get("http://localhost:3000/users")
        this.users = response.data
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
    sortedUser(list) {
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
    createUser() {
      this.addMode = "ADD"
      this.newUser = {
        designation: ""
      }
      this.openModal()
    },
    editUser(item){
      this.newUser = JSON.parse(JSON.stringify(item))
      this.addMode = "EDIT"
      this.openModal()
    },
    async saveUser(e) {
      e.preventDefault()

      if (this.addMode === "ADD") {
        try {
          await axios.post("http://localhost:3000/users", this.newUser)
          this.closeModal()
          this.getUsers()
        } catch (err) {
          console.error(err)
        }
      } 
      else if (this.addMode === "EDIT") {
        try {
          await axios.put(`http://localhost:3000/users/${this.newUser.id}`, this.newUser)
          this.closeModal()
          this.getUsers()
        } catch (err) {
          console.error(err)
        }
      }
    },
    async deleteUser(item) {
      const result = await Swal.fire({
        title: `Are you sure you want to delete the user "${item.username}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#898989',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/users/${item.id}`)
          this.getUsers()

          let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
          if(loggedInUser.id === item.id) {
            localStorage.clear();
            this.$router.push({name: 'LoginPage'})
          }
        } catch (err) {
          console.error(err)
        }
      }
        
    }
  },
};
</script>
   