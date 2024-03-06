import { NextApiRequest, NextApiResponse } from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";

interface ResponseData {
    success: boolean
    dietaryReq: string
    extra: string
    displayName: string
}

interface ResponseError {
    error: boolean
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | ResponseError>
) {
    if (req.method !== "POST") return res.status(405).json({
        error: true,
        message: 'Only HTTP verb POST is permitted',
    });

    const attemptedAuth = await getServerSession(req, res, authOptions);

    if (!attemptedAuth?.microsoft.email) {
        return res.status(400).json({
            error: true, message: 'You must include the session token with the Authorization header',
        });
    }

    if (!String(process.env.ADMINS).split(',').includes(attemptedAuth?.microsoft.email.split('@soton.ac.uk').join(''))) {
        return res.status(403).json({
            error: true, message: 'You are not authorized to check people in, naughty naughty!!',
        });
    }


    const formData: { id: string } = req.body;

    if (!formData.id) {
        return res.status(400).json({
            error: true, message: 'Missing id property',
        });
    }

    try {
        const user = await prisma.user.update({
            data: {
                checkedIn: true,
            },
            where: {
                id: formData.id
            }
        })

        res.status(200).json({
            success: true,
            dietaryReq: user.dietaryReq || '',
            extra: user.extra || '',
            displayName: user.displayName
        });
    } catch (e) {
        res.status(404).json({
            error: true,
            message: "This user does not exist"
        });
    }

}
