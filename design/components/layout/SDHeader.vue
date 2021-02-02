<template>
  <div class="container flex justify-between px-8 mx-auto my-5 lg:px-0">
    <h1 class="text-2xl font-bold uppercase transform -rotate-6">
      <span
        class="text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text"
      >
        Dirty Thirties
      </span>
    </h1>
    <div class="flex items-center lg:hidden" @click.prevent="open">
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
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </div>
    <div class="items-center hidden space-x-6 lg:flex">
      <nuxt-link to="#" class="font-semibold uppercase hover:underline"
        >Start</nuxt-link
      >
      <nuxt-link to="#" class="font-semibold uppercase hover:underline"
        >Service</nuxt-link
      >
      <nuxt-link to="#" class="font-semibold uppercase hover:underline"
        >About</nuxt-link
      >
      <nuxt-link to="#" class="font-semibold uppercase hover:underline"
        >Contact</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'SDHeader',
  methods: {
    open() {
      this.$emit('sidebar-open')
    },
  },
}
</script>
