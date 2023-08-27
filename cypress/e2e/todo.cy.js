// todo.cy.js

describe('Todo', () => {

  beforeEach(() => {
    cy.visit('http://localhost:8080');
  })

  it('adds a new todo item', () => {
    const newTask = 'Buy groceries'
    const newDate = '2023-03-01'
    
    cy.get('input[type="text"]').type(newTask) 
    cy.get('input[type="date"]').type(newDate)

    cy.get('button').contains('Add Task').click()

  })

  it('marks a todo as completed', () => {
    const newTask = 'Buy groceries'
    
    cy.get('input[type="text"]').type(newTask)
    cy.get('button').contains('Add Task').click()
  })

  it('edits an existing todo', () => {
    const newTask = 'Buy groceries'
    
    cy.get('input[type="text"]').type(newTask)
    cy.get('button').contains('Add Task').click()

    cy.get('input[type="text"]').clear().type('Buy fruits')

  })

  it('deletes a todo', () => {
    const newTask = 'Buy groceries'
    
    cy.get('input[type="text"]').type(newTask)
    cy.get('button').contains('Add Task').click()


    cy.get('li').should('not.exist')
  })

  it('filters pending todos', () => {
    const newTask1 = 'Buy groceries'
    const newTask2 = 'Pay bills'
    
    cy.get('input[type="text"]').type(newTask1)
    cy.get('button').contains('Add Task').click()

    cy.get('input[type="text"]').type(newTask2)
    cy.get('button').contains('Add Task').click()

    cy.get('button').contains('Pending Tasks').click()

  })

})