import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Store e2e test', () => {
  const storePageUrl = '/store';
  const storePageUrlPattern = new RegExp('/store(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const storeSample = { name: 'Mountains wireless Market', address: 'overriding', createTimestamp: '2022-09-02T00:23:23.664Z' };

  let store;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/store/api/stores+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/store/api/stores').as('postEntityRequest');
    cy.intercept('DELETE', '/services/store/api/stores/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (store) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/store/api/stores/${store.id}`,
      }).then(() => {
        store = undefined;
      });
    }
  });

  it('Stores menu should load Stores page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('store');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Store').should('exist');
    cy.url().should('match', storePageUrlPattern);
  });

  describe('Store page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(storePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Store page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/store/new$'));
        cy.getEntityCreateUpdateHeading('Store');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', storePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/store/api/stores',
          body: storeSample,
        }).then(({ body }) => {
          store = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/store/api/stores+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [store],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(storePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Store page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('store');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', storePageUrlPattern);
      });

      it('edit button click should load edit Store page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Store');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', storePageUrlPattern);
      });

      it('edit button click should load edit Store page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Store');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', storePageUrlPattern);
      });

      it('last delete button click should delete instance of Store', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('store').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', storePageUrlPattern);

        store = undefined;
      });
    });
  });

  describe('new Store page', () => {
    beforeEach(() => {
      cy.visit(`${storePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Store');
    });

    it('should create an instance of Store', () => {
      cy.get(`[data-cy="name"]`).type('streamline').should('have.value', 'streamline');

      cy.get(`[data-cy="address"]`).type('Avon Account uniform').should('have.value', 'Avon Account uniform');

      cy.get(`[data-cy="status"]`).select('OPEN');

      cy.get(`[data-cy="createTimestamp"]`).type('2022-09-02T09:41').blur().should('have.value', '2022-09-02T09:41');

      cy.get(`[data-cy="updateTimestamp"]`).type('2022-09-01T20:30').blur().should('have.value', '2022-09-01T20:30');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        store = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', storePageUrlPattern);
    });
  });
});
