
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
/* 1 INSERT */
    // const user = await prisma.user.create({
    //     data: {
    //         email: 'elsa@prisma.io'
    //     ,   name: 'Elsa Prisma'
    //     }
    // })

/* MANY INSERTS */
    // const createMany = await prisma.user.createMany({
    //     data: [
    //         { name: 'Bob', email: 'bob@prisma.io' }
    //     ,   { name: 'Yewande', email: 'yewande@prisma.io' }
    //     ,   { name: 'Angelique', email: 'angelique@prisma.io' }
    //     ]
    // })

/* UPDATE */
    // const updateUser = await prisma.user.update({
    //     where: {
    //         email: 'yewande@prisma.io'
    //     },
    //     data: {
    //         name: 'Dörte'
    //     ,   email: 'doerte@prisma.io'
    //     },
    // })

/* READ 1 */
    // const user = await prisma.user.findUnique({
    //     where: {
    //         email: 'angelique@prisma.io'
    //     }
    // })

/* READ MANY */
// const users = await prisma.user.findMany({
    //     where: {
        //         name: null
        //     }
        // })
        
/* DELETE MANY */
    // const users = await prisma.user.deleteMany({
    //     where: {
    //         name: null
    //     }
    // })
    
    // console.log( users.map( user => user.id ))

    const users = await prisma.user.findMany()
    console.log(users)
}
  
main()
.then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})