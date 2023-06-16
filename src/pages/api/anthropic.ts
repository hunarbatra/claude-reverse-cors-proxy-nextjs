import fetch from 'node-fetch';
import Cors from 'cors';
// @ts-ignore
import initMiddleware from '../../lib/init-middleware';
import { NextApiRequest, NextApiResponse } from 'next';

const cors = initMiddleware(
    Cors({
        methods: ['POST'],
    })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await cors(req, res);

    try {
        if (!req.body) {
            throw new Error('Invalid Body');
        }

        if (
            !req.headers['x-api-key'] ||
            !req.body.prompt ||
            !req.body.model ||
            !req.body.max_tokens_to_sample ||
            !req.body.temperature
        ) {
            throw new Error('apiKey, prompt, temperature, max_tokens_to_sample, and model are required!');
        }

        const response = await fetch('https://api.anthropic.com/v1/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // @ts-ignore
                'x-api-key': req.headers['x-api-key'],
            },
            body: JSON.stringify({
                prompt: req.body.prompt,
                model: req.body.model,
                max_tokens_to_sample: req.body.max_tokens_to_sample,
                stop_sequences: req.body.stop_sequences,
                temperature: req.body.temperature,
            }),
        });

        const data = await response.json();

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        // @ts-ignore
        if (error.message) {
            res.json({
                success: false,
                // @ts-ignore
                error: error.message,
            });
        } else {
            res.json({
                success: false,
                error: 'Unknown Error!',
            });
        }
    }
}