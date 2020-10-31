<template>
     <button  @click.prevent="sortlist">{{buttontext}}</button>
</template>
<script>
export default {
    name: "SortListButton",
    data(){
        return {
            buttontext: "ascending"
        }
    },
    methods:{
        sortlist(){
            this.$emit("sortorder", this.buttontext)
            //ternärer Ausdruck
            this.buttontext = this.buttontext=="ascending"?"descending":"ascending"
        }
    }    
}
</script>