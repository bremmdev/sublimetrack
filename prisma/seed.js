const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seed() {
 //createCategories()
// createUsers()
 // createBudgets()
 createExpenses()
}

seed()

async function createUsers() {
  //create testusers with 'banaan' password
  const testUsers = await prisma.user.createMany({
    data: [
      {
        username: "matt123",
        passwordHash:
          "$2a$10$Od4oIfW1IZyyQUvc.X96EOhCGNcG.XAm49fA/CA5F43znmgO2dCIe",
        firstName: "Matt",
        lastName: "Bremm",
      },
      {
        username: "johndoe",
        passwordHash:
          "$2a$10$Od4oIfW1IZyyQUvc.X96EOhCGNcG.XAm49fA/CA5F43znmgO2dCIe",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
      },
    ],
  });
}

async function createCategories() {
  await prisma.category.createMany({
    data: [ { name: 'housing' }, { name: 'utilities' }, { name: 'food' }, { name: 'transportation' }, { name: 'insurance' }, { name: 'recreation' }, { name: 'medical costs'}, { name: 'investing'}, { name: 'miscellaneous '}, { name: 'memberships'}, {name: 'pets'} ]
  });
}

async function createBudgets() {
  await prisma.budget.createMany({
    data: [ 
    { amount: 2000, startDate: new Date("2022-01-01"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3"},
    { amount: 999.99, startDate: new Date("2022-02-01"), userId: "c97df944-505b-4508-8528-1de8da028fc7"} 
  ]
  });
}

async function createExpenses() {
  await prisma.expense.createMany({
    data: [ 
    { title: 'Delta Supermarket', amount: -34.43, date: new Date("2022-02-06"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "14ebbabc-146f-4b49-afda-1e06c38aca14"},
    { title: 'Sushi Paradise', amount: -44.13, date: new Date("2022-02-13"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "d3fcd29c-27c2-40b5-a781-9494d057aa6f"},
    { title: 'Storm Energy', amount: -89.54, date: new Date("2022-02-10"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "1c7ead9d-4273-4593-bbfe-6e96fb124dd7"},
    { title: 'Health Insurance Company', amount: -125, date: new Date("2022-02-10"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "1127ecd8-4172-41aa-9689-6d8d4b8bb057"},
    { title: 'Water Company', amount: -13, date: new Date("2022-02-15"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "1c7ead9d-4273-4593-bbfe-6e96fb124dd7"},
    { title: 'test', amount: -100.43, date: new Date("2022-02-10"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "14ebbabc-146f-4b49-afda-1e06c38aca14"},
    { title: 'Water Company', amount: -13, date: new Date("2022-02-15"), userId: "c97df944-505b-4508-8528-1de8da028fc7", categoryId: "1c7ead9d-4273-4593-bbfe-6e96fb124dd7"}, 
  ]
  });
}
