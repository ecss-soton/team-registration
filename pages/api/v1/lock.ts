import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// interface RequestData {
//   shouldLock: boolean
// }

interface ResponseData {
  locked: boolean
}

interface ResponseError {
  error: boolean;
  message: string;
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<ResponseData | ResponseError>) {
  if (req.method !== 'POST') return res.status(405).json({
    error: true, message: 'Only HTTP verb POST is permitted',
  });

  if (!(req.body.shouldLock === true || req.body.shouldLock === false)) return res.status(405).json({
    error: true, message: 'Must contain the boolean parameter shouldLock.',
  });

  const attemptedAuth = await getServerSession(req, res, authOptions);

  if (!attemptedAuth) {
    return res.status(400).json({
      error: true, message: 'You must include the session token with the Authorization header',
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: attemptedAuth.id,
    }
  });

  let team;
  if (user?.teamId) {
    team = await prisma.team.findUnique({
      where: {
        id: user.teamId
      },
      include: {
        members: {
          orderBy: {
            joinedTeamTime: "asc"
          }
        }
      }
    })
  }

  if (!user || !team) return res.status(404).json({
    error: true, message: 'Could not find user or user not in a team.',
  });

  if (team.members[0].id !== user.id) return res.status(405).json({
    error: true, message: 'The user does not have the right rank.',
  });

  if (team.locked === req.body.shouldLock) return res.status(405).json({
    error: true, message: 'The team is already locked/unlocked.',
  });

  const updateTeam = await prisma.team.update({
    where: {
      id: team.id
    },
    data: {
      locked: !team.locked
    }
  })


  if (!updateTeam) {
    return res.status(500).json({
      error: true, message: 'Unable to update team',
    });
  }

  res.status(200).json({
    locked: updateTeam.locked
  });
}
