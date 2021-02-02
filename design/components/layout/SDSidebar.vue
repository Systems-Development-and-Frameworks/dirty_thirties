<template>
  <nav
    class="absolute inset-y-0 right-0 w-full max-w-md p-6 text-white bg-gray-800"
  >
    <a href="#" @click.prevent="close" class="inline-block mb-12">
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </a>

    <div class="space-y-2">
      <nuxt-link to="#" class="block uppercase hover:font-semibold"
        >Start</nuxt-link
      >
      <nuxt-link to="#" class="block uppercase hover:font-semibold"
        >Service</nuxt-link
      >
      <nuxt-link to="#" class="block uppercase hover:font-semibold"
        >About</nuxt-link
      >
      <nuxt-link to="#" class="block uppercase hover:font-semibold"
        >Contact</nuxt-link
      >
    </div>
  </nav>
</template>

<script>
export default {
  name: 'SDSidebar',
  methods: {
    close() {
      this.$emit('sidebar-close')
    },
  },
}
</script>
