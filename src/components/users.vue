<template>
  <h1>Users</h1>

    <div class="grid grid-cols-3 my-4">
        <div class="">
          <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="search" placeholder="Search" autocomplete="off" required/>
        </div>   

        <div class="col-start-3 text-right">            
            <button class="btn-sm bg-blue-600 text-white" @click="addCountVue.newItem()"><span class="material-icons mi-sm">add</span> New User</button>
        </div>
    </div>

    <!-- table -->
    <table class="table-striped table-bordered bg-white">
        <thead class="sticky -top-4 z-10 bg-white">
            <tr class="text-blue-600">
                <th>#</th>
                <th class="cursor-pointer" @click="sortTable('name')">Name
                    <span class="material-icons mi-md ml-1" id="count-sort-name">unfold_more</span>
                </th>
                <th class="cursor-pointer" @click="sortTable('value')">Value
                    <span class="material-icons mi-md ml-1" id="count-sort-value">unfold_more</span>
                </th>
                <th class="w-36">Action</th>
            </tr>
        </thead>
         <tbody>
            
        </tbody>
    </table>
    
</template>

<script>
export default {
  name: "UsersPage",
  data() {
    return {
      search: '',
    };
  },
  methods: {
    
  },
};
</script>
   