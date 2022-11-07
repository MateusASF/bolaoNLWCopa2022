import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main(){
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'appdomat@gmail.com',
            avatarUrl: 'https://github.com/mateusasf.png',
        }
    })
    
    const pool = await prisma.pool.create({
        data: {
            title: 'Example Pool',
            code: 'BOL123',
            ownerid: user.id,

            participant: {
                create:{
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-10T22:00:42.287Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-12-10T22:00:42.287Z',
            firstTeamCountryCode: 'FR',
            secondTeamCountryCode: 'US',

            guesses: {
                create: {
                    firstTeamPoints: 4,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        } 
                    }
                }
            }
        }
    })
}

main()