const incrementItems = (list) => {
    return list.map(item => item+1)
}

describe('incrementItems', () => {
    it('adds +1 to every list item', () =>{
        expect(incrementItems([1,2,3])).toEqual([2,3,4])

    })
})