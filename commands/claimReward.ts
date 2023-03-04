import { SlashCommand, SlashCreator, CommandContext, CommandOptionType } from 'slash-create';
import { IReward, IUser, IUserReward, knex } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'r',
      description: 'Claim a reward',
      options: [
        {
          type: CommandOptionType.INTEGER,
          name: 'id',
          description: "The reward's id",
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const [user, reward] = await knex.transaction(async (tx) => [
      (
        await tx<IUser>('User').where({
          id: ctx.user.id
        })
      )[0],
      (
        await tx<IReward>('Reward').where({
          id: ctx.options.id
        })
      )[0]
    ]);

    if (!reward) return "This reward doesn't exist";

    const points = user?.points ?? 0;

    if (points < reward.price) return "You don't have enough points to claim this reward";

    await knex<IUserReward>('UserReward').insert({
      rewardId: ctx.options.id,
      userId: ctx.user.id,
      pending: true
    });

    return "Reward claimed, waiting for the admin's confirmation";
  }
}
