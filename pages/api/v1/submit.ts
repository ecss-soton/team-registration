import { NextApiRequest, NextApiResponse } from "next";
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";
import {RegisterForm, SubmissionForm} from "@/types/types";
import validator from 'validator';

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

    if (!attemptedAuth?.microsoft.email) {
        return res.status(400).json({
            error: true, message: 'You must include the session token with the Authorization header',
        });
    }

    const formData: SubmissionForm = req.body;

    if (!formData.name || !formData.githubLink || !validator.isURL(formData.githubLink)) {
        return res.status(400).json({
            error: true, message: 'Missing or invalid properties',
        });
    }

    try {

        const user = await prisma.user.findUnique({
            where: {
                id: attemptedAuth.id
            }
        })

        if (!user || user.teamId == null) {
            return res.status(404).json({
                error: true,
                message: "This user does not exist or is not in a team"
            });
        }

        await prisma.team.update({
            data: {
                name: formData.name,
                githubLink: formData.githubLink,
                submissionTime: new Date(),
            },
            where: {
                id: user.teamId
            }
        })

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