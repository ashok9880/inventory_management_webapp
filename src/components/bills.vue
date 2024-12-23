<template>
  <navBar/>
  
  <div class="p-4">
     <div class="grid grid-cols-3 my-4">
        <div class="">
          <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" v-model="search" placeholder="Search" autocomplete="off" required/>
        </div>   

        <div class="col-start-3 text-right">            
            <button class="btn-sm bg-[#00416ada] text-white" @click="createBill()"><span class="material-icons mi-sm">add</span> New Bill</button>
        </div>
    </div>

    <!-- table -->
    <table class="table-striped table-bordered">
        <thead>
            <tr class="text-[#00416ada]">
              <th>#</th>
              <th class="cursor-pointer" @click="sortTable('date')">Date<span class="material-icons mi-md ml-1">{{ getSortIcon('date') }}</span></th>
              <th class="cursor-pointer" @click="sortTable('billNo')">Bill No<span class="material-icons mi-md ml-1">{{ getSortIcon('billNo') }}</span></th>
              <th class="cursor-pointer" @click="sortTable('customerName')">Customer Name<span class="material-icons mi-md ml-1">{{ getSortIcon('customerName') }}</span></th>
              <th class="cursor-pointer" @click="sortTable('totalQty')">Total Qty<span class="material-icons mi-md ml-1">{{ getSortIcon('totalQty') }}</span></th>
              <th class="cursor-pointer" @click="sortTable('totalAmount')">Total Amount<span class="material-icons mi-md ml-1">{{ getSortIcon('totalAmount') }}</span></th>
              <th class="w-36">Action</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(bill, idx) in filteredBills" :key="bill.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ bill.date }}</td>
              <td>{{ bill.billNo }}</td>
              <td>{{ bill.customerName ?? "" }}</td>
              <td>{{ bill.totalQty ?? 0 }}</td>
              <td>₹ {{ bill.totalAmount ?? 0 }}</td>
              <td class="w-36 text-center">
                <button type="button" class="text-sm btn-sm bg-[#00416ada] text-white" @click="viewBill(bill)"><span class="material-icons mi-sm">visibility</span></button>
              </td>
            </tr>
        </tbody>
    </table>
  </div>

  <!--Modal-->
  <form @submit.prevent="saveBill">
    <Modal :isOpen="isModalOpen" :widthClass="modalWidth">
      <template #header>
        <h3 class="text-lg font-semibold" v-if="addMode == 'EDIT'">Edit - {{ newBill.billNo }}</h3>
        <h3 class="text-lg font-semibold" v-else-if="addMode == 'VIEW'">View - Bill No {{ newBill.billNo }}</h3>
        <h3 class="text-lg font-semibold" v-else>New Bill</h3>
        <button @click="closeModal" class="text-white hover:text-gray-200"><span class="material-icons">close</span></button>
      </template>

      <template #body>
        <div class="grid grid-cols-3 gap-2 items-center mb-4">
            <div>
              <label>Date</label>
              <input v-model="newBill.date" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" :disabled="addMode=='VIEW'" required/>
            </div>

            <div>
              <label>Bill No</label>
              <input v-model="newBill.billNo" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" :disabled="addMode=='VIEW'" required/>
            </div>

            <div>
              <label>Customer Name</label>
              <input v-model="newBill.customerName" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" :disabled="addMode=='VIEW'" required/>
            </div>
            
        </div>
        
        <!-- products table -->
        <table class="table-bordered">
            <thead>
              <tr class="text-[#00416ada]">
                <th>#</th>
                <th>Product Name</th>
                <th>Price (₹)</th>
                <th>Current Stock</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th v-if="addMode!='VIEW'">Actions</th>
              </tr>
            </thead>

            <tbody>
                <tr v-for="(prod, idx) in newBill.products" :key="prod.id">
                    <td>{{ idx + 1 }}</td>
                    <td>
                        <select class="w-full px-4 py-2 mt-4 cursor-pointer border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" v-model="prod.productId" @change="getStock(prod)" :disabled="addMode=='VIEW'" required>
                            <option value="" disabled selected>Select Product</option>
                            <option v-for="option in products" :key="option.id" :value="option.id">
                                {{ option.name }}
                            </option>
                        </select>
                    </td>
                    <td>{{ prod.price ?? 0 }}</td>
                    <td>{{ prod.currentStock ?? 0 }}</td>
                    <td>
                        <input v-model="prod.quantity" type="number" @input="calculateAmount(prod)"  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00416ada]" :disabled="addMode=='VIEW'" required/>
                    </td>
                    <td>{{ prod.amount ?? 0 }}</td>
                    <td v-if="addMode!='VIEW'" class="text-center">
                        <button type="button" class="text-sm btn-sm btn-orange" @click="addProduct()"><span class="material-icons mi-sm">add</span></button>
                        <button type="button" class="text-sm btn-sm btn-red" @click="deleteProduct(prod, idx)"><span class="material-icons mi-sm">delete</span></button>
                    </td>
                </tr>
            </tbody>
        </table>

      </template>

      <template #footer>
        <label v-if="addMode=='VIEW'" class="px-4">Created By: <b>{{ newBill.createdBy}}</b></label>
        <label v-if="addMode=='VIEW'" class="px-4">Created On: <b>{{ moment(newBill.createdAt).format('MMMM Do YYYY, h:mm:ss a') }}</b></label>
        <label class="px-4">Total Qty: <b>{{ newBill.totalQty ?? 0}}</b></label>
        <label class="px-4">Grand Total: <b>₹ {{ newBill.totalAmount ?? 0}}</b></label>
        <button @click="closeModal" type="button" class="btn-md bg-gray-300 text-gray-700 hover:bg-gray-400">Cancel</button>
        <button v-if="addMode!='VIEW'" type="submit" class="btn-md bg-[#00416ada] text-white">Save</button>
      </template>
    </Modal>
  </form>
   
</template>

<script>
import navBar from './navBar.vue'
import axios from "axios";
import Modal from "./ModalComponent.vue";
import moment from "moment";
import Swal from 'sweetalert2';

export default {
  name: "BillsPage",
  components: {
    navBar,
    Modal,
  },

  data() {
    return {
      isModalOpen: false,
      modalWidth: 'w-3/4',
      addMode: 'ADD',
      newBill: {
        products: []
      },
      search: '',
      sort: 'date',
      sortOrder: 'desc',  
      bills: [],
      products: [],
      loggedUserData: {},
      moment
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

    this.getBills()
    this.getProducts()
  },
  computed: {                 
    filteredBills() {
        let fltrBills = []  
        let searchText = this.search.toLowerCase().split(' ').join('')

        //Sort
        let sorted = this.sortedBills(this.bills)
        sorted.forEach(item => {
            if ((item.billNo.toLowerCase().split(' ').join('').includes(searchText))
                || (item.customerName.toLowerCase().split(' ').join('').includes(searchText)))
            {
              fltrBills.push(item)
            }     
        })
        return fltrBills
    },
  },
  methods: {
    async getBills() {
      try {
        const response = await axios.get("http://localhost:3000/bills")
        this.bills = response.data
      } catch (err) {
        console.error(err)
      }
    },
    async getProducts() {
      try {
        const response = await axios.get("http://localhost:3000/products")
        this.products = response.data
        console.log(this.products, "products")
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
    sortedBills(list) {
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
    createBill() {
      this.addMode = "ADD"
      this.newBill = {
        products: []
      }
      this.addProduct()
      this.openModal()
    },
    viewBill(item) {
      this.newBill = JSON.parse(JSON.stringify(item))
      this.addMode = "VIEW"
      this.openModal()
    },
    editBill(item){
      this.newBill = JSON.parse(JSON.stringify(item))
      this.addMode = "EDIT"
      this.openModal()
    },
    addProduct() {
        this.newBill.products.push({
            productId: "",
            price: 0,
            currentStock: 0,
            quantity: 0,
            amount: 0
        })
    },
    deleteProduct(prod, idx) {
        this.newBill.products.splice(idx, 1)
        this.calculateAmount(prod)
    },
    getStock(prod) {
        const selectedProduct = this.products.find(product => product.id === prod.productId)
       
        if (selectedProduct) {
            prod.currentStock = selectedProduct.stock
            prod.price = selectedProduct.price
        }
    },
    calculateAmount(prod) {
        if(prod.quantity > prod.currentStock) {
          prod.quantity = 0
          prod.amount = 0
          Swal.fire({
            icon: 'error',
            title: 'Insufficient stock',
            text: `Insufficient stock for product ID: ${prod.productId}`,
            confirmButtonText: 'Okay'
          });
        }
        
        prod.amount = (prod.price) * (prod.quantity)

        this.newBill.totalQty = 0
        this.newBill.totalAmount = 0

        this.newBill.products.forEach(p=>{
            this.newBill.totalQty += p.quantity
            this.newBill.totalAmount += p.amount
        })
    },
    async saveBill(e) {
      e.preventDefault()
      
      //Duplicate products check
      let duplicateItem = {}
      let b_duplicateItemExits = false
      
      this.newBill.products.forEach( item => {
        if (duplicateItem[item.productId]) {
          b_duplicateItemExits = true
        }
        duplicateItem[item.productId] = true                            
      })

      if (b_duplicateItemExits) {
        Swal.fire({
          icon: 'error',
          title: 'Duplicate Products',
          text: "Duplicate products found in the bill. Please remove duplicates before saving",
          confirmButtonText: 'Okay'
        });

        return;
      }

      this.newBill.createdAt = Date.now()
      this.newBill.createdBy = this.loggedUserData.username

      console.log(this.newBill)

      //Update product stocks before saving the bill
      await this.updateProductStocks();

      if (this.addMode === "ADD") {
        try {
          await axios.post("http://localhost:3000/bills", this.newBill)
         
          this.closeModal()
          this.getBills()

        } catch (err) {
          console.error(err.message);
          alert(err.message);
        }
      } 
      else if (this.addMode === "EDIT") {
        try {
          await axios.put(`http://localhost:3000/bills/${this.newBill.id}`, this.newBill)
          this.closeModal()
          this.getBills()
        } catch (err) {
          console.error(err)
        }
      }
    },
    async updateProductStocks() {
      try {
        for (const prod of this.newBill.products) {
            
          const response = await axios.get(`http://localhost:3000/products/${prod.productId}`);
          const product = response.data

          const updatedStock = product.stock - prod.quantity
          
          //Save the updated stock back to the db.json
          await axios.put(`http://localhost:3000/products/${prod.productId}`, {...product, stock: updatedStock})

        }
      } catch (err) {
          console.error(err)
      }
    },
    async deleteBill(item) {
        try {
            await axios.delete(`http://localhost:3000/bills/${item.id}`)
            this.getBills()
        } catch (err) {
            console.error(err)
        }
    }
  },
};
</script>
   