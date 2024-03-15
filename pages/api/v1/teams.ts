import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../prisma/client';
import {Team} from '@/types/types';
import {getServerSession} from 'next-auth';
import {authOptions} from '../auth/[...nextauth]';

interface ResponseData {
  yourTeam?: string,
  yourRank?: number,
  teams: Team[]
}

interface ResponseError {
  error: boolean;
  message: string;
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<ResponseData | ResponseError>) {
  if (req.method !== 'GET') return res.status(405).json({
    error: true, message: 'Only HTTP verb GET is permitted',
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

  if (!user) {
    return res.status(404).json({
      error: true, message: 'This user does not exist.',
    });
  }

  let teams = await prisma.team.findMany({
    include: {
      members: {
        orderBy: {
          joinedTeamTime: 'asc'
        }
      }
    }
  });

  if (!teams) {
    teams = [];
  }

  const yourTeam = user.teamId ?? undefined;
  let yourRank = teams.find((t) => t.id === yourTeam)?.members.findIndex((elem) => elem.id === user.id);

  res.status(200).json({
    yourTeam, yourRank, teams: teams.map((team) => {
      return {
        locked: team.locked, id: team.id, members: team.members.map((member) => {
          return {
            name: member.displayName ?? '',
            discordTag: member.discordTag ?? undefined,
            tags: member.tags,
            yearOfStudy: member.yearOfStudy ?? undefined
          };
        })
      };
    })
  });
}
