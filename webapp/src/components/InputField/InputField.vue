<!--
 * Component, creates input field and button
 * 
 * Authors: Sarah Mendenhall (GitHub: SarahLM), Jennifer Vormann (GitHub: FrauMauz), Nele Herzog (GitHub: Herzogin).
 * October 26, 2020
 -->

<!-- HTML section -->
<template>
  <div id="basic-Input" class="input" >
    <input v-model='newTitle'>
    <button  @click="$emit('create-item', newTitle)">create</button>
  </div>
</template>

<!-- script section -->
<script>
  export default {
    name: 'BasicInput',
    props: [],
    data () {
      return {
        newTitle: ''
      }
    }
  }
</script>
