<!--
 * Component, creates input field and button
 * 
 * Authors: Sarah Mendenhall (GitHub: SarahLM), Jennifer Vormann (GitHub: FrauMauz), Nele Herzog (GitHub: Herzogin).
 * October 26, 2020
 -->

<!-- HTML section -->
<template>
  <form id="basic-Input" class="input" >
    <input v-model='newTitle'>
    <button  @click.prevent ="additem">create</button>
  </form>
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
    },
    methods:{
      additem(){
        this.$emit('create-item', this.newTitle)
        this.newTitle=""
        }
    }
  }
</script>
