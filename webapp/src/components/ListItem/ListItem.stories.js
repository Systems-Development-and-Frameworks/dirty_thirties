import ListItem from "./ListItem.vue"

export default {
    title: 'Dirty/ListItem',
    component: ListItem,
    argTypes: {
      deleteItem: { action: "deleteItem"},
      updateItem: { action: "updateItem"}
    },
  };
  
  const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ListItem},
    template: '<list-item @update-item="updateItem" @delete-item="deleteItem" v-bind="$props" />',
    
});
  
  export const Base = Template.bind({});
  Base.args = {
      item:{
        id: 0,
        title: 'VueJS',
        votes: 3
      }
  };