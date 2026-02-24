describe('Конструктор бургера', () => {
  const BUN_ID = '643d69a5c3f7b9001cfa093c';
  const INGREDIENT_ID = '643d69a5c3f7b9001cfa0941';

  beforeEach(() => {
    // Удаляем надоедливый iframe
    cy.window().then((win) => {
      const iframe = win.document.getElementById('webpack-dev-server-client-overlay');
      if (iframe) iframe.remove();
    });

    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    cy.setCookie('accessToken', 'test-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains('Соберите бургер', { timeout: 10000 }).should('be.visible');
    cy.contains('Булки').should('exist');
    cy.get(`[data-cy="ingredient-${BUN_ID}"]`, { timeout: 10000 }).should('exist');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('должен добавлять булку в конструктор', () => {
    cy.get(`[data-cy="ingredient-${BUN_ID}"]`).find('button').contains('Добавить').click({ force: true });
    
    cy.get('[data-cy="constructor"]').within(() => {
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });
  });

  it('должен добавлять начинку в конструктор', () => {
    cy.contains('Начинки').click({ force: true });
    cy.get(`[data-cy="ingredient-${INGREDIENT_ID}"]`).find('button').contains('Добавить').click({ force: true });
    
    cy.get('[data-cy="constructor"]').within(() => {
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });
  });

  describe('Модальные окна', () => {
    it('должен открывать модальное окно с правильным ингредиентом', () => {
      cy.get(`[data-cy="ingredient-${BUN_ID}"]`).find('a').first().click({ force: true });
      
      cy.get('[data-cy="modal"]').within(() => {
        cy.contains('Детали ингредиента').should('be.visible');
        cy.contains('Краторная булка N-200i').should('be.visible');
      });
      cy.contains('1255').should('be.visible');
    });

    it('должен закрывать модальное окно по крестику', () => {
      cy.get(`[data-cy="ingredient-${BUN_ID}"]`).find('a').first().click({ force: true });
      
      cy.get('[data-cy="modal"]').within(() => {
        cy.contains('Детали ингредиента').should('be.visible');
      });
      
      cy.get('[data-cy="modal-close"]').click({ force: true });
      cy.wait(500);
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.get(`[data-cy="ingredient-${BUN_ID}"]`).find('a').first().click({ force: true });
      
      cy.get('[data-cy="modal"]').within(() => {
        cy.contains('Детали ингредиента').should('be.visible');
      });
      
      cy.get('[data-cy="overlay"]').click({ force: true });
      cy.wait(500);
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  it('должен создавать заказ и очищать конструктор', () => {
    cy.get(`[data-cy="ingredient-${BUN_ID}"]`).find('button').contains('Добавить').click({ force: true });
    
    cy.contains('Начинки').click({ force: true });
    cy.get(`[data-cy="ingredient-${INGREDIENT_ID}"]`).find('button').contains('Добавить').click({ force: true });
    
    cy.get('[data-cy="order-button"]').click({ force: true });
    cy.wait('@createOrder');
    
    cy.get('[data-cy="modal"]').within(() => {
      cy.contains('12345').should('be.visible');
    });
    
    cy.get('[data-cy="modal-close"]').click({ force: true });
    cy.wait(500);
    cy.get('[data-cy="modal"]').should('not.exist');
    
    cy.get('[data-cy="constructor"]').within(() => {
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
}); 
