import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";

interface ResponseData {
    success: boolean
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

    try {
        const user = await prisma.user.findUnique({
            where: { id: attemptedAuth.id },
            select: { intrested: true }
        });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "This user does not exist"
            });
        }
        let flippedRegistered = false
        if (user.intrested == null) {
            flippedRegistered = true
        } else {
            flippedRegistered = !user.intrested;
        }


        await prisma.user.update({
            data: {
                intrested: flippedRegistered,
            },
            where: {
                id: attemptedAuth.id
            }
        });

        res.status(200).json({
            success: true,
        });
        } catch (e) {
        res.status(404).json({
            error: true,
            message: "This user does not exist"
        });
        }
    }