import { VercelRequest, VercelResponse } from '@vercel/node';
import { knex } from '../db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await knex('Reward').limit(1);
  res.status(200).end('Cron completed!');
}
