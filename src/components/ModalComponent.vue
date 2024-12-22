<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-end">
    
    <div class="bg-white h-full shadow-lg flex flex-col" :class="widthClass">
      <!-- Header -->
      <div class="bg-[#00416ada] text-white px-4 py-3 flex justify-between items-center">
        <slot name="header"></slot>
      </div>

      <!-- Body -->
      <div class="p-4 flex-1 overflow-y-auto">
        <slot name="body"></slot>
      </div>

      <!-- Footer -->
      <div class="bg-gray-200 px-4 py-3 flex justify-end items-center space-x-4">
        <slot name="footer"></slot>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "ModalComponent",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    widthClass: {
      type: String,
    }
  },
  methods: {
    
  },
};
</script>

