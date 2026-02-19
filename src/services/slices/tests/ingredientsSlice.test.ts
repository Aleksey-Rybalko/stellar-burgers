import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false
  };

  const mockIngredients = [
    { _id: '1', name: 'Ингредиент 1', type: 'bun', price: 100 },
    { _id: '2', name: 'Ингредиент 2', type: 'main', price: 200 }
  ];

  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен устанавливать loading в true при pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const actual = ingredientsReducer(initialState, action);
    expect(actual.loading).toBe(true);
    expect(actual.ingredients).toEqual([]);
  });

  it('должен сохранять данные и устанавливать loading в false при fulfilled', () => {
    const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients };
    const actual = ingredientsReducer(initialState, action);
    expect(actual.loading).toBe(false);
    expect(actual.ingredients).toEqual(mockIngredients);
  });

  it('должен устанавливать loading в false при rejected', () => {
    const action = { type: fetchIngredients.rejected.type };
    const actual = ingredientsReducer(initialState, action);
    expect(actual.loading).toBe(false);
    expect(actual.ingredients).toEqual([]);
  });
});
