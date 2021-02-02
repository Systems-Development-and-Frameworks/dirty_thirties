<template>
  <div class="flex flex-row px-2 lg:flex-col">
    <div class="flex mb-0 mr-8 lg:flex-col lg:items-center lg:mr-0 lg:mb-4">
      <div class="w-24 h-24 bg-gray-800 rounded-full"></div>
    </div>
    <div>
      <div class="flex flex-row mb-3 lg:flex-col lg:items-center lg:space-y-3">
        <h3 class="font-bold uppercase">{{ title }}</h3>
      </div>
      <p class="mb-3">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur
        aperiam officiis rerum assumenda obcaecati culpa quaerat optio.
      </p>
      <nuxt-link
        to="#"
        class="inline-block px-3 py-1 font-semibold text-white uppercase bg-gray-800 border-2 border-gray-800 hover:bg-transparent hover:text-gray-800"
      >
        MORE
      </nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SDCard',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
