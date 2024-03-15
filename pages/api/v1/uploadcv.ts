import {NextApiRequest, NextApiResponse} from 'next';
import prisma from '../../../prisma/client';
import {getServerSession} from 'next-auth';
import {authOptions} from '../auth/[...nextauth]';
import formidable from 'formidable'
import {readFileSync, existsSync, mkdirSync} from 'fs'
import PersistentFile from "formidable/PersistentFile";

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

    const CV_DIRECTORY = `${process.cwd()}/cvs`
    if (!existsSync(CV_DIRECTORY)) {
        mkdirSync(CV_DIRECTORY)
    }

    const MB_IN_BYTES = 1_048_576
    const MAX_FILE_SIZE = 10 * MB_IN_BYTES

    const form = formidable({
        uploadDir: CV_DIRECTORY,
        maxFiles: 1,
        maxFileSize: MAX_FILE_SIZE,
    })


    const [_, files] = await form.parse(req)

    const userCvFile = files?.cv?.[0] as (PersistentFile | undefined)

    if (!userCvFile) {
        console.log("files", files)
        return res.status(400).json({
            error: true, message: 'You have not attached the file',
        });
    }

    const userCv = userCvFile.toJSON()

    const DOT_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    const DOT_DOC = 'application/msword'

    const allowedMimeTypes = ['application/pdf', DOT_DOC, DOT_DOCX]
    if (!allowedMimeTypes.includes(userCv.mimetype || '')) {
        console.log("mime", userCv.mimetype)
        return res.status(415).json({
            error: true, message: 'Unsupported file type. Only PDF, DOC, DOCX are allowed',
        });
    }

    if (userCv.size > MAX_FILE_SIZE) {
        return res.status(400).json({
            error: true, message: 'File is too large',
        });
    }

    const contents = readFileSync(`${CV_DIRECTORY}/${userCv.newFilename}`)

    await prisma.user.update({
        data: {
            cv: contents,
            cvFileName: userCv.originalFilename
        },
        where: {
            id: attemptedAuth.id,
        }
    });

    return res.status(200).json({
        success: true,
        fileName: userCv.originalFilename || 'No file name'
    });
}
