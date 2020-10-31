import {mount} from '@vue/test-utils'
import List from '@/components/List.vue'

describe (
    "List.vue", ()=> {

        test("Test if List is empty",()=> {
            const wrapper = mount(List,
                {
                    propsData:
                {
                    listItems:[]
                }
            
            })
            expect(wrapper.html()).toContain("list is empty :(")
        })
        test("Test if list is not empty",()=> {
            const wrapper = mount(List,
                {
                    propsData:
                {
                    listItems:[{
                        
                            id: 0,
                            title: "VueJSTest",
                            votes: 3,
                            },
                    ]
                }
            
            })
            expect(wrapper.html()).not.toContain("list is empty :(")
        })
        
    }
)