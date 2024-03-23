import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
await prisma.game.deleteMany({})
  const game1 = await prisma.game.create({
    data: {
      player1: 'player1',
      player2: 'player2',
    },
  })
  const game2 = await prisma.game.create({
    data: {
      player1: 'player2',
      player2: 'player1',
    },
  })

  const game3 = await prisma.game.create({
    data: {
      player1: 'player1',
      player2: 'player2',
    },
  })
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