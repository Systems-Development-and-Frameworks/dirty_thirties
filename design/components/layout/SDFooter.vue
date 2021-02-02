<template>
  <footer class="bg-gray-500">
    <div class="container mx-auto py-8 px-8 xl:px-0">
      <div class="space-y-2 flex flex-col">
        <nuxt-link to="#" class="uppercase font-sm hover:underline"
          >Imprint</nuxt-link
        >
        <nuxt-link to="#" class="uppercase font-sm hover:underline"
          >Data Privacy</nuxt-link
        >
        <span class="uppercase font-sm">&copy; 2021 | dirty</span>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SDFooter',
}
</script>
