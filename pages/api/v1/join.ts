import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../prisma/client';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from '../auth/[...nextauth]';

// interface RequestData {
//   team?: string
// }

interface ResponseError {
    error: boolean;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{} | ResponseError>) {
    if (req.method !== 'POST') return res.status(405).json({
        error: true, message: 'Only HTTP verb POST is permitted',
    });

    const attemptedAuth = await unstable_getServerSession(req, res, authOptions);

    if (!attemptedAuth?.discord.tag) {
        return res.status(400).json({
            error: true, message: 'You must include the session token with the Authorization header',
        });
    }

    if (req.body.team) {
        // user wants to join a specific team.
        if (typeof req.body.team !== "string") return res.status(405).json({
            error: true, message: 'team parameter must be a string id.',
        });

        const team = await prisma.team.findFirst({
            where: {
                id: req.body.team
            }, include: {
                members: true
            }
        });

        if (!team) return res.status(405).json({
            error: true, message: 'team parameter must be between 0 and number of teams.',
        });

        if (team.members.length >= 4 || team.locked) return res.status(405).json({
            error: true, message: 'team is already filled or locked.',
        });

        const user = await prisma.user.update({
            where: {
                id: attemptedAuth.id,
            }, data: {
                teamId: team.id, joinedTeamTime: new Date()
            }
        });

        if (!user) return res.status(405).json({
            error: true, message: 'team does not exist.',
        });

    } else {
        const user = await prisma.user.update({
            where: {
                id: attemptedAuth.id,
            },
            data: {
                joinedTeamTime: new Date(),
                team: {
                    create: {}
                }
            }
        });

        if (!user) return res.status(405).json({
            error: true, message: 'could not create team.',
        });
    }

    await prisma.team.deleteMany({
        where: {
            members: {
                none: {}
            }
        }
    });

    res.status(200).json({});
}