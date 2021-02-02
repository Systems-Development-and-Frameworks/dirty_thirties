<template>
  <div class="relative flex flex-col h-screen font-sans antialiased">
    <SDHeader @sidebar-open="showSidebar = true" />
    <SDSidebar
      @sidebar-close="showSidebar = false"
      :class="{ block: showSidebar, hidden: !showSidebar }"
    />
    <Nuxt class="flex-grow" />
    <SDFooter />
  </div>
</template>

<script>
import SDHeader from '@/components/layout/SDHeader'
import SDFooter from '@/components/layout/SDFooter'
import SDSidebar from '@/components/layout/SDSidebar'

export default {
  name: 'LayoutDefault',
  components: {
    SDHeader,
    SDFooter,
    SDSidebar,
  },
  data() {
    return {
      showSidebar: false,
    }
  },
}
</script>
