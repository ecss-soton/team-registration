import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../prisma/client';
import {getServerSession} from 'next-auth';
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

    const attemptedAuth = await getServerSession(req, res, authOptions);

    if (!attemptedAuth?.microsoft.email) {
        return res.status(400).json({
            error: true, message: 'You must include the session token with the Authorization header',
        });
    }

    try {
        await prisma.user.update({
            where: {
                id: attemptedAuth.id,
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

        res.status(200).json({});
    } catch {
        return res.status(400).json({
            error: true, message: 'There was an error leaving that team',
        });
    }
}
