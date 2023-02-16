import prisma from "./client";
import {writeFileSync,mkdirSync} from 'fs'

(async () => {

    mkdirSync('./cvs')

    const users = await prisma.user.findMany({
        select: {
            cvFileName: true,
            firstName: true,
            lastName: true,
            sotonId: true,
        }
    })

    console.log(`Found ${users.length} users`)

    for (const user of users) {
        if (!user.cvFileName) continue;

        const data = await prisma.user.findUnique({
            where: {
                sotonId: user.sotonId,
            },
            select: {
                cv: true
            }
        })

        if (!data?.cv) continue;

        console.log(`Downloaded CV for ${user.sotonId} - ${user.cvFileName}`)

        writeFileSync(`./cvs/${user.sotonId}-${user.cvFileName}`, data.cv)
    }
})()