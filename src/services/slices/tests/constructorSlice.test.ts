import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../constructorSlice';

describe('constructorSlice', () => {
  const mockBun = {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const mockIngredient = {
    _id: 'ing-1',
    name: 'Ингредиент',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 50,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const initialState = {
    bun: null,
    ingredients: []
  };

  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен добавлять ингредиент', () => {
    const actual = constructorReducer(initialState, addIngredient(mockIngredient));
    expect(actual.ingredients).toHaveLength(1);
    expect(actual.ingredients[0]).toMatchObject({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  it('должен удалять ингредиент', () => {
    const stateWithIngredient = constructorReducer(initialState, addIngredient(mockIngredient));
    const idToRemove = stateWithIngredient.ingredients[0].id;
    const actual = constructorReducer(stateWithIngredient, removeIngredient(idToRemove));
    expect(actual.ingredients).toHaveLength(0);
  });

  it('должен изменять порядок ингредиентов', () => {
    let state = constructorReducer(initialState, addIngredient({ ...mockIngredient, _id: '1' }));
    state = constructorReducer(state, addIngredient({ ...mockIngredient, _id: '2' }));
    
    const actual = constructorReducer(state, moveIngredient({ fromIndex: 1, toIndex: 0 }));
    expect(actual.ingredients[0]._id).toBe('2');
    expect(actual.ingredients[1]._id).toBe('1');
  });
});
