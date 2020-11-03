<!--
 * Component, creates every item on the list and buttons to vote up, vote down and remove
 * 
 * Authors: Sarah Mendenhall (GitHub: SarahLM), Jennifer Vormann (GitHub: FrauMauz), Nele Herzog (GitHub: Herzogin).
 * October 26, 2020
 -->

 <!-- HTML section -->
<template>
  <div id="list-item">
    <h2>{{item.title}} - ({{item.votes}})</h2>
    <button @click="upvoteItem();">Upvote</button>
    <button @click="downvoteItem();">Downvote</button>
    <button @click="$emit('delete-item', item)">Remove</button>
    <br />
  </div>
</template>

<!-- script section -->
<script>
export default {
  name: 'ListItem',
  props: ['item'],
  methods: {
    upvoteItem() {
      this.item.votes++;
      this.$emit('update-item', this.item)
    },
    downvoteItem() {
      this.item.votes--;
      this.$emit('update-item', this.item)
    }
    
  }
}
</script>

<!-- CSS style section -->
<style>
  button {
    position: relative;
    margin: 1em;
    padding: .3em 1em;
    width: 8em;
    background: black;
    color: white;
    border: 1px solid white;
    border-radius: 3px;
    cursor: pointer;
    transition: all ease 1s;
  }
  button:hover, button:active {
    outline: none;
    background: white;
    border: 1px solid red;
    border-radius: 3px;
    color: red;
  }
</style>
