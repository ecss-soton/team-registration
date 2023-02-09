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

    const formData: { kickId: string } = req.body;

    if (!formData.kickId) {
        return res.status(400).json({
            error: true, message: 'Missing kickId property',
        });
    }

    const attemptedAuth = await unstable_getServerSession(req, res, authOptions);

    if (!attemptedAuth?.microsoft.email) {
        return res.status(400).json({
            error: true, message: 'You must include the session token with the Authorization header',
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: attemptedAuth.id,
        },
    });

    if (!user?.teamId) {
        return res.status(404).json({
            error: true, message: 'This user does not exist or is not in a team',
        });
    }

    const team = await prisma.team.findUnique({
        where: {
            id: user.teamId,
        },
        include: {
            members: {
                orderBy: {
                    joinedTeamTime: 'asc'
                }
            }
        }
    });

    if (!team) {
        return res.status(404).json({
            error: true, message: 'This team no longer exists',
        });
    }

    if (team.members[0].id !== user.id) return res.status(403).json({
        error: true, message: 'You must be the team admin to kick other players',
    });

    if (!team.members.find(i => i.id == formData.kickId)) {
        return res.status(404).json({
            error: true, message: 'This user is not in that team',
        });
    }


    try {
        await prisma.user.update({
            where: {
                id: formData.kickId,
            },
            data: {
                teamId: null,
                joinedTeamTime: null
            }
        });

        await prisma.team.deleteMany({
            where: {
                members: {
                    none: {}
                }
            }
        });

        return res.status(200).json({ success: true });
    } catch {
        return res.status(400).json({
            error: true, message: 'There was an error leaving that team',
        });
    }
}