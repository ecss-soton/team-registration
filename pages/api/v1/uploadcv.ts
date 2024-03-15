import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../prisma/client';
import {getServerSession} from 'next-auth';
import {authOptions} from '../auth/[...nextauth]';
// @ts-ignore
import {IncomingForm} from 'formidable'
import {promises as fs} from 'fs'

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


    const data: Promise<{ fields: {}, files: { cv: { size: number, filepath: string, originalFilename: string }}}> = new Promise((resolve, reject) => {
        const form = new IncomingForm()

        form.parse(req, (err: any, fields: any, files: any) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })

    let resolvedData;

    try {
        resolvedData = await data
    } catch (e) {
        return res.status(400).json({
            error: true, message: 'Error parsing form data',
        });
    }

    if (!resolvedData?.files?.cv?.filepath) {
        return res.status(400).json({
            error: true, message: 'You have not attached the file',
        });
    }

    const MB_IN_BYTES = 1_048_576
    const MAX_FILE_SIZE = 10 * MB_IN_BYTES

    if (resolvedData.files.cv.size > MAX_FILE_SIZE) {
        return res.status(400).json({
            error: true, message: 'File is too large',
        });
    }

    const contents = await fs.readFile(resolvedData.files.cv.filepath)

    await prisma.user.update({
        data: {
            cv: contents,
            cvFileName: resolvedData.files.cv.originalFilename
        },
        where: {
            id: attemptedAuth.id,
        }
    });

    res.status(200).json({
        success: true,
        fileName: resolvedData.files.cv.originalFilename
    });
}
