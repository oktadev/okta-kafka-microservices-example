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

describe('StoreAlert e2e test', () => {
  const storeAlertPageUrl = '/store-alert';
  const storeAlertPageUrlPattern = new RegExp('/store-alert(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const storeAlertSample = {
    storeName: 'SCSI Bedfordshire Markets',
    storeStatus: 'Right-sized Group Technician',
    timestamp: '2022-09-01T17:59:28.423Z',
  };

  let storeAlert;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/alert/api/store-alerts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/alert/api/store-alerts').as('postEntityRequest');
    cy.intercept('DELETE', '/services/alert/api/store-alerts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (storeAlert) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/alert/api/store-alerts/${storeAlert.id}`,
      }).then(() => {
        storeAlert = undefined;
      });
    }
  });

  it('StoreAlerts menu should load StoreAlerts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('store-alert');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('StoreAlert').should('exist');
    cy.url().should('match', storeAlertPageUrlPattern);
  });

  describe('StoreAlert page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(storeAlertPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create StoreAlert page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/store-alert/new$'));
        cy.getEntityCreateUpdateHeading('StoreAlert');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', storeAlertPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/alert/api/store-alerts',
          body: storeAlertSample,
        }).then(({ body }) => {
          storeAlert = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/alert/api/store-alerts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [storeAlert],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(storeAlertPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details StoreAlert page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('storeAlert');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', storeAlertPageUrlPattern);
      });

      it('edit button click should load edit StoreAlert page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('StoreAlert');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', storeAlertPageUrlPattern);
      });

      it('edit button click should load edit StoreAlert page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('StoreAlert');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', storeAlertPageUrlPattern);
      });

      it('last delete button click should delete instance of StoreAlert', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('storeAlert').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', storeAlertPageUrlPattern);

        storeAlert = undefined;
      });
    });
  });

  describe('new StoreAlert page', () => {
    beforeEach(() => {
      cy.visit(`${storeAlertPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('StoreAlert');
    });

    it('should create an instance of StoreAlert', () => {
      cy.get(`[data-cy="storeName"]`).type('Metical SDR Balanced').should('have.value', 'Metical SDR Balanced');

      cy.get(`[data-cy="storeStatus"]`).type('Borders array adapter').should('have.value', 'Borders array adapter');

      cy.get(`[data-cy="timestamp"]`).type('2022-09-02T03:25').blur().should('have.value', '2022-09-02T03:25');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        storeAlert = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', storeAlertPageUrlPattern);
    });
  });
});
