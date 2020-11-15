<!--
 * Entry Point to Web Application
 * 
 * Authors: Sarah Mendenhall (GitHub: SarahLM), Jennifer Vormann (GitHub: FrauMauz), Nele Herzog (GitHub: Herzogin).
 * October 26, 2020
 -->

 <!-- HTML section -->
<template>
  <div id="app">
    <h1>News List</h1>
    <SortListButton
    @sortorder="sortItems"
    />
    <List id="li" :list-items="sortedItems"
      @delete-item='deleteItem($event)'
      @update-item='updateItem($event)'
    ></List>
    <InputField id="in" @create-item='createItem($event)'></InputField>
  </div>
</template>

<!-- script section -->
<script>
import  InputField  from './components/InputField/InputField'
import  List  from './components/List/List'
import SortListButton from './components/SortListButton/SortListButton'

export default {
  name: 'App',
  components:{
    List,
    InputField,
    SortListButton
  },
  data() {
    return {
      sortOrder :"ascending",
      counter: 3,
      // pre-filled input fields with ID, titles and votes
      news:[
        {
          id: 0,
          title: 'VueJS',
          votes: 3
        },
        {
          id: 1,
          title: 'just',
          votes: 2
        },
        {
          id: 2,
          title: 'drives you crazy!',
          votes: 0
        }
      ],
    }
  },

  methods: {
    // creation of new item
    createItem(newTitle) {
      this.news.push({
          id: this.counter++,
          title: newTitle,
          votes: 0
      });
      // this.sortItems();
    },
    // deleting an item
    deleteItem(item) {
      this.news = this.news.filter(el => el.id != item.id);
    },
    //updating an item
    updateItem(item) {
      this.news.map(el => {
        if (el.id == item.id) {
          return item
        }
        return el
      })
      // this.sortItems();
    },
    //sorting of items 
    sortItems(sort="ascending") {
      this.sortOrder = sort;
      // if (sort=="ascending"){
      // this.news = [...this.news].sort((a,b) => (a.votes < b.votes) ? 1 : ((b.votes < a.votes) ? -1 : 0));
      
      // }
      // else{
      //   this.news = [...this.news].sort((a,b) => (a.votes > b.votes) ? 1 : ((b.votes > a.votes) ? -1 : 0));
      // }
    }
  },
  computed:{
    sortedItems(){
       if (this.sortOrder=="ascending"){
      return [...this.news].sort((a,b) => (a.votes < b.votes) ? 1 : ((b.votes < a.votes) ? -1 : 0));
      
      }
      return [...this.news].sort((a,b) => (a.votes > b.votes) ? 1 : ((b.votes > a.votes) ? -1 : 0));
      
    }
  },
  mounted() {
    // this.sortItems()
  },
}
</script>

<!-- CSS style section -->
<style>
  h1 {
    color:#080808;
    font-family:arial;
  }
  #app {
    text-align:center;
  }

  #in {
    margin-top: 3em;
  }

  #li {
    color:#080808;
    font-family:arial;
  }
</style>
