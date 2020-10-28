const incrementItems = (list) => {
    return list.map(item => item)
}

describe('incrementItems', () => {
    it('adds +1 to every list item', () =>{
        expects(incrementItems([1,2,3])).toEqual([2,3,4])

    })
})