import { NextApiRequest, NextApiResponse } from "next";
import {auth} from "../../../middleware/auth";
import {unstable_getServerSession} from "next-auth";
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

    const attemptedAuth = await unstable_getServerSession(req, res, authOptions);

    if (!attemptedAuth?.discord.tag) {
        return res.status(400).json({
            error: true, message: 'You must include the session token with the Authorization header',
        });
    }

    console.log(attemptedAuth)


    // TODO make this way more secure
    const user2 = await prisma.user.update({
        data: {
            formData: req.body
        },
        where: {
            discordTag: attemptedAuth.discord.tag
        }
    })

    res.status(200).json({
        success: true
    });
}