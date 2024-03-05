import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma/client';
import { Team } from '@/types/types';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
// @ts-ignore
import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'

export const config = {
    api: {
        bodyParser: false,
    }
};


interface ResponseData {
    success: boolean
    fileName: string;
}

interface ResponseError {
    error: boolean;
    message: string;
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<ResponseData | ResponseError>) {



    if (req.method !== 'POST' && req.method !== 'DELETE') return res.status(405).json({
        error: true, message: 'Only HTTP verb POST and DELETE are permitted',
    });

    const attemptedAuth = await unstable_getServerSession(req, res, authOptions);

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

    if (!user || !user.registered) {
        return res.status(404).json({
            error: true, message: 'This user does not exist or is not registered.',
        });
    }


    if (req.method === 'DELETE') {
        await prisma.user.update({
            data: {
                cv: null,
                cvFileName: null
            },
            where: {
                id: attemptedAuth.id,
            }
        });

        return res.status(200).json({
            success: true,
            fileName: ''
        });
    }


    const data: { fields: {}, files: { cv: { size: number, filepath: string, originalFilename: string }}} = await new Promise((resolve, reject) => {
        const form = new IncomingForm()

        form.parse(req, (err: any, fields: any, files: any) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })

    console.log("cv data", data)

    if (!data?.files?.cv) {
        return res.status(400).json({
            error: true, message: 'You have not attached the file',
        });
    }

    const MB_IN_BYTES = 1_048_576
    const MAX_FILE_SIZE = 10 * MB_IN_BYTES

    if (data.files.cv.size > MAX_FILE_SIZE) {
        return res.status(400).json({
            error: true, message: 'File is too large',
        });
    }

    const contents = await fs.readFile(data?.files?.cv.filepath)

    console.log("cv contents", contents)

    await prisma.user.update({
        data: {
            cv: contents,
            cvFileName: data.files.cv.originalFilename
        },
        where: {
            id: attemptedAuth.id,
        }
    });

    res.status(200).json({
        success: true,
        fileName: data.files.cv.originalFilename
    });
}
