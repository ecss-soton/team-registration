import { NextApiRequest, NextApiResponse } from "next";
import {auth} from "../../../middleware/auth";

interface ResponseData {
    message: string
}

interface ResponseError {
    error: boolean
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | ResponseError>
) {
    if (req.method !== "GET") return res.status(405).json({
        error: true,
        message: 'Only HTTP verb GET is permitted',
    });
    const check = auth(req, res);
    if (check) return check;

    if (req.body.error == true) {
        return res.status(400).json({
            error: true,
            message: 'You must provide both a userId and guildId in the body of the request',
        })
    }

    res.status(200).json({
        message: "Hello world!"
    });
}