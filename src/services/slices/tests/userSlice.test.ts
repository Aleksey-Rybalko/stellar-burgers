import userReducer, { 
  checkUserAuth, 
  loginUser, 
  registerUser, 
  logoutUser,
  clearError 
} from '../userSlice';

describe('userSlice', () => {
  const initialState = {
    user: null,
    isLoading: false,
    error: null
  };

  const mockUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('checkUserAuth', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: checkUserAuth.pending.type };
      const actual = userReducer(initialState, action);
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = { type: checkUserAuth.fulfilled.type, payload: mockUser };
      const actual = userReducer(initialState, action);
      expect(actual.isLoading).toBe(false);
      expect(actual.user).toEqual(mockUser);
      expect(actual.error).toBeNull();
    });

    it('должен очищать пользователя при rejected', () => {
      const action = { type: checkUserAuth.rejected.type };
      const actual = userReducer(initialState, action);
      expect(actual.isLoading).toBe(false);
      expect(actual.user).toBeNull();
    });
  });

  describe('loginUser', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: loginUser.pending.type };
      const actual = userReducer(initialState, action);
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = { type: loginUser.fulfilled.type, payload: mockUser };
      const actual = userReducer(initialState, action);
      expect(actual.isLoading).toBe(false);
      expect(actual.user).toEqual(mockUser);
      expect(actual.error).toBeNull();
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = { type: loginUser.rejected.type, error: { message: 'Ошибка входа' } };
      const actual = userReducer(initialState, action);
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe('Ошибка входа');
    });
  });

  describe('registerUser', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: registerUser.pending.type };
      const actual = userReducer(initialState, action);
      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = { type: registerUser.fulfilled.type, payload: mockUser };
      const actual = userReducer(initialState, action);
      expect(actual.isLoading).toBe(false);
      expect(actual.user).toEqual(mockUser);
      expect(actual.error).toBeNull();
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = { type: registerUser.rejected.type, error: { message: 'Ошибка регистрации' } };
      const actual = userReducer(initialState, action);
      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe('Ошибка регистрации');
    });
  });

  it('должен очищать пользователя при logout', () => {
    const stateWithUser = { ...initialState, user: mockUser };
    const action = { type: logoutUser.fulfilled.type };
    const actual = userReducer(stateWithUser, action);
    expect(actual.user).toBeNull();
  });

  it('должен очищать ошибку при clearError', () => {
    const stateWithError = { ...initialState, error: 'Ошибка' };
    const actual = userReducer(stateWithError, clearError());
    expect(actual.error).toBeNull();
  });
});
