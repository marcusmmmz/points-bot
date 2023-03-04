import Knex from 'knex';

export const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

export interface IUser {
  id: string;
  points: number;
}
export interface IReward {
  id: number;
  item: string;
  price: number;
}
export interface IUserReward {
  id: string;
  rewardId: number;
  userId: string;
  pending: boolean;
}
