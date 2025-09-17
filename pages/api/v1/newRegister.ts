import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";

interface ResponseData {
    success: boolean;
}

interface ResponseError {
    error: boolean;
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | ResponseError>
) {
    if (req.method !== "POST") return res.status(405).json({
        error: true,
        message: "Only HTTP verb POST is permitted",
    });

    const attemptedAuth = await getServerSession(req, res, authOptions);

    if (!attemptedAuth?.microsoft.email) {
        return res.status(400).json({
            error: true,
            message: "You must include the session token with the Authorization header",
        });
    }

    const formData = req.body;

    // Validate required fields
    if (!formData.fullName || !formData.agreePhotos) {
        return res.status(400).json({
            error: true,
            message: "Missing required properties",
        });
    }

    try {
        await prisma.user.update({
            data: {
                fullName: formData.fullName,
                discordId: formData.discordUsername || undefined,
                intro: formData.intro || undefined,
                participation: formData.participation,
                teamMember1: formData.teamMember1 || undefined,
                teamMember2: formData.teamMember2 || undefined,
                teamMember3: formData.teamMember3 || undefined,
                teamMember4: formData.teamMember4 || undefined,
                dietaryReq: formData.dietaryReq || undefined,
                howDidHear: formData.howDidHear || undefined,
                photoConsent: formData.agreePhotos,
                registered: true,
            },
            where: {
                id: attemptedAuth.id,
            },
        });

        res.status(200).json({
            success: true,
        });
    } catch (e) {
        res.status(404).json({
            error: true,
            message: "This user does not exist",
        });
    }
}
