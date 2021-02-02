<template>
  <div class="bg-img bg-cover bg-center">
    <div class="container mx-auto px-8 h-64">
      <div class="flex h-full items-center">
        <div class="ml-8">
          <h2
            class="uppercase text-5xl text-white mb-4 leading-none font-semibold"
          >
            May we <br />
            introduce
          </h2>

          <nuxt-link
            to="#"
            class="bg-white uppercase font-semibold text-gray-900 px-3 py-1 hover:bg-transparent hover:text-white border-white border-2"
          >
            MORE
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SDHero',
}
</script>

<style>
.bg-img {
  background-image: url(https://images.unsplash.com/photo-1508093047876-ad6a918f9273?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=60);
}
</style>
