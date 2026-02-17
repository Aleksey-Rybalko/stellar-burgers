describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.setCookie('accessToken', 'test-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains('Соберите бургер', { timeout: 10000 }).should('be.visible');
    cy.contains('Булки').should('exist');
    cy.contains('Краторная булка N-200i', { timeout: 10000 }).should('exist');
  });

  it('должен добавлять ингредиент в конструктор', () => {
    cy.contains('Краторная булка N-200i').parents('li').contains('Добавить').click();
    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');
  });

  it('должен добавлять начинку в конструктор', () => {
    cy.contains('Начинки').click();
    cy.contains('Биокотлета из марсианской Магнолии')
      .parents('li')
      .contains('Добавить')
      .click();
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('должен открывать и закрывать модальное окно ингредиента по крестику', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.get('button[type="button"]').last().click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('должен создавать заказ и очищать конструктор', () => {
    cy.contains('Краторная булка N-200i').parents('li').contains('Добавить').click();
    
    cy.contains('Начинки').click();
    cy.contains('Биокотлета из марсианской Магнолии')
      .parents('li')
      .contains('Добавить')
      .click();
    
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');
    
    cy.contains('12345').should('be.visible');
    cy.get('button[type="button"]').last().click();
    
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');
  });
});
