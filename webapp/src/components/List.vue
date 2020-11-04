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
      v-on:delete-item="$emit('delete-item', $event)"
      v-on:update-item="$emit('update-item', $event)"
      >
    </ListItem>
  </div>
</template>

<!-- script section -->
<script>
  import  ListItem from './ListItem'
  export default {
    name: 'List',
    components: {
        ListItem
    },
    props: ['listItems']
  }
</script>
