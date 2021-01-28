import {mount} from '@vue/test-utils'
import SortListButton from '@/components/SortListButton/SortListButton.vue'

describe (
    "SortListButton.vue", ()=> {

        test("Button emits sort event",()=> {
            const wrapper = mount(SortListButton,
                {
                  
            
            })
            wrapper.trigger("click")
           
           expect(wrapper.emitted()).toHaveProperty("sortorder")
        }),

        test("Button emits ascending",()=> {
            const wrapper = mount(SortListButton,
                {
                  
            
            })
            wrapper.trigger("click")
     
           expect(wrapper.emitted().sortorder[0]).toContain("ascending")
        })
        test("Button emits descending",async()=> {
            const wrapper = mount(SortListButton,{})
            wrapper.trigger("click")
            wrapper.trigger("click")
           expect(wrapper.emitted().sortorder[1]).toContain("descending")
        })
        
    }
)