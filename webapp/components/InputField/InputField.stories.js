import InputField from "./InputField.vue"

export default {
    title: 'Dirty/InputField',
    component: InputField,
    argTypes: {
      createItem: { action: "clicked"}
    },
  };
  
  const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { InputField},
    template: '<input-field @create-item="createItem" v-bind="$props" />',
  });
  
  export const Base = Template.bind({});
  Base.args = {
    
  };
  
  