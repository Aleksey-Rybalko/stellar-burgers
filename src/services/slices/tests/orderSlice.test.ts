import orderReducer, { createOrder, resetOrder } from '../orderSlice';

describe('orderSlice', () => {
  const initialState = {
    order: null,
    orderRequest: false,
    orderModalData: null
  };

  const mockOrder = {
    _id: 'order-1',
    status: 'created',
    name: 'Тестовый заказ',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 12345,
    ingredients: ['ing-1', 'ing-2']
  };

  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен устанавливать orderRequest в true при pending', () => {
    const action = { type: createOrder.pending.type };
    const actual = orderReducer(initialState, action);
    expect(actual.orderRequest).toBe(true);
    expect(actual.order).toBeNull();
    expect(actual.orderModalData).toBeNull();
  });

  it('должен сохранять заказ при fulfilled', () => {
    const action = { type: createOrder.fulfilled.type, payload: mockOrder };
    const actual = orderReducer(initialState, action);
    expect(actual.orderRequest).toBe(false);
    expect(actual.order).toEqual(mockOrder);
    expect(actual.orderModalData).toEqual(mockOrder);
  });

  it('должен устанавливать orderRequest в false при rejected', () => {
    const action = { type: createOrder.rejected.type };
    const actual = orderReducer(initialState, action);
    expect(actual.orderRequest).toBe(false);
    expect(actual.order).toBeNull();
    expect(actual.orderModalData).toBeNull();
  });

  it('должен сбрасывать состояние при resetOrder', () => {
    const stateWithOrder = {
      order: mockOrder,
      orderRequest: false,
      orderModalData: mockOrder
    };
    const actual = orderReducer(stateWithOrder, resetOrder());
    expect(actual.order).toBeNull();
    expect(actual.orderRequest).toBe(false);
    expect(actual.orderModalData).toBeNull();
  });
});
