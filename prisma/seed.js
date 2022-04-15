const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seed() {
 //createCategories()
// createUsers()
 // createBudgets()
 //createExpenses()
 createExpensesBatch()
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
    data: [ { name: 'housing', color: '#87CEEB' }, { name: 'utilities', color: '#FF5555' }, { name: 'food', color: '#9986dd' }, { name: 'transportation', color: '#AAAAAA' }, { name: 'insurance', color: '#fbb871' }, { name: 'recreation', color: '#00FF95' }, { name: 'medical costs', color: '#ec6d71'}, { name: 'investing', color: '#b7d6b7'}, { name: 'miscellaneous', color: '#5959ab'}, { name: 'memberships', color: '#FFD8CC'}, {name: 'pets', color: '#f599dc'} ]
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
    { title: 'Delta Supermarket', amount: 34.43, date: new Date("2022-03-06"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "d05a1cdd-5341-4abd-9a53-e1a012d0dd3d"},
    { title: 'Sushi Paradise', amount: 44.13, date: new Date("2022-03-13"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "d05a1cdd-5341-4abd-9a53-e1a012d0dd3d"},
    { title: 'Storm Energy', amount: 89.54, date: new Date("2022-03-10"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "3fdb010d-547d-451f-856a-0e0d3e207462"},
    { title: 'Health Insurance Company', amount: 125, date: new Date("2022-03-10"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "3fdb010d-547d-451f-856a-0e0d3e207462"},
    { title: 'Banana Company', amount: 13, date: new Date("2022-03-15"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "8297ef3b-8790-44d8-86de-cf211f31dcfd"},
    { title: 'test', amount: 100.43, date: new Date("2022-03-10"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "2544e726-3c82-42f7-91b9-def5b4b4f444"},
    { title: 'Lol Company', amount: 13, date: new Date("2022-03-15"), userId: "c97df944-505b-4508-8528-1de8da028fc7", categoryId: "2cd7d5d9-be84-472d-ae2d-19b79b9b22fb"}, 
  ]
  });
}


async function createExpensesBatch() {
  await prisma.expense.createMany({
    data: [ 
    { title: 'Delta Supermarket', amount: 34.43, date: new Date("2022-04-07"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "d05a1cdd-5341-4abd-9a53-e1a012d0dd3d"},
    { title: 'Sushi Paradise', amount: 44.13, date: new Date("2022-04-7"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "d05a1cdd-5341-4abd-9a53-e1a012d0dd3d"},
    { title: 'Storm Energy', amount: 89.54, date: new Date("2022-04-7"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "3fdb010d-547d-451f-856a-0e0d3e207462"},
    { title: 'Health Insurance Company', amount: 125, date: new Date("2022-04-7"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "3fdb010d-547d-451f-856a-0e0d3e207462"},
    { title: 'Banana Company', amount: 13, date: new Date("2022-04-7"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "8297ef3b-8790-44d8-86de-cf211f31dcfd"},
    { title: 'test', amount: 100.43, date: new Date("2022-04-8"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "2544e726-3c82-42f7-91b9-def5b4b4f444"},
    { title: 'Lol Company', amount: 13, date: new Date("2022-04-10"), userId: "c97df944-505b-4508-8528-1de8da028fc7", categoryId: "2cd7d5d9-be84-472d-ae2d-19b79b9b22fb"}, 
    { title: 'Banana', amount: 13, date: new Date("2022-04-10"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "8297ef3b-8790-44d8-86de-cf211f31dcfd"},
    { title: 'testi', amount: 100.43, date: new Date("2022-04-11"), userId: "70e0cff2-7589-4de8-9f2f-4e372a5a15f3", categoryId: "2544e726-3c82-42f7-91b9-def5b4b4f444"},
    { title: 'Lol Companyf', amount: 13, date: new Date("2022-04-12"), userId: "c97df944-505b-4508-8528-1de8da028fc7", categoryId: "2cd7d5d9-be84-472d-ae2d-19b79b9b22fb"}, 
  ]
  });
}
