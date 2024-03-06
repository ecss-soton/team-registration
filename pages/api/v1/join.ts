import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../prisma/client';
import {getServerSession} from 'next-auth';
import {authOptions} from '../auth/[...nextauth]';
import { nanoid } from 'nanoid'

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

    const attemptedAuth = await getServerSession(req, res, authOptions);

    if (!attemptedAuth?.microsoft.email) {
        return res.status(400).json({
            error: true, message: 'You must include the session token with the Authorization header',
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: attemptedAuth.id,
        }
    });

    if (!user || !user.registered) {
        return res.status(404).json({
            error: true, message: 'This user does not exist or is not registered.',
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

        if (team.members.length >= 4 || (!req.body.fromCode && team.locked)) return res.status(405).json({
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
                    create: {
                        id: nanoid(8)
                    }
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
