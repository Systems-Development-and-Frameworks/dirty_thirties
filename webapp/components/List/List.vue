<!--
 * Component, creates list for items
 * 
 * Authors: Sarah Mendenhall (GitHub: SarahLM), Jennifer Vormann (GitHub: FrauMauz), Nele Herzog (GitHub: Herzogin).
 * October 26, 2020
 -->

 <!-- HTML section -->
<template>
  <div id="list">
      <ListItem
      v-for="item in listItems"
      :key="item.id"
      :item="item"
      @delete-item="$emit('delete-item', $event)"
      @update-item="$emit('update-item', $event)"
      >
    </ListItem>
    <p v-if="listItems.length==0">list is empty :(</p>
  </div>
</template>

<!-- script section -->
<script>
  import  ListItem from '@/components/ListItem/ListItem'
  export default {
    name: 'List',
    components: {
        ListItem
    },
    props: {
      listItems: {
        required: false,
        type: Array,
        default: () => [],
      },
},
  }
</script>
