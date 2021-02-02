<template>
  <div>
    <SDHero />

    <div class="container px-8 py-16 mx-auto xl:px-0">
      <div class="flex flex-col space-y-10 lg:flex-row lg:space-y-0">
        <SDCard class="w-full lg:w-1/3" title="what"></SDCard>
        <SDCard class="w-full lg:w-1/3" title="we"></SDCard>
        <SDCard class="w-full lg:w-1/3" title="do"></SDCard>
      </div>
    </div>
  </div>
</template>

<script>
import SDHero from '@/components/layout/SDHero'
import SDCard from '@/components/SDCard'

export default {
  name: 'PageIndex',
  components: {
    SDHero,
    SDCard,
  },
}
</script>
