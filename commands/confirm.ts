import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { IReward, IUser, IUserReward, knex } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'confirm',
      description: "Confirm a user's reward",
      options: [
        {
          type: CommandOptionType.USER,
          name: 'user',
          description: 'User that will receive the reward',
          required: true
        },
        {
          type: CommandOptionType.INTEGER,
          name: 'reward',
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
          id: ctx.options.user
        })
      )[0],
      (
        await tx<IReward>('Reward').where({
          id: ctx.options.reward
        })
      )[0]
    ]);

    if (!reward) return "This reward doesn't exist";

    const points = user?.points ?? 0;

    if (points < reward.price) return "The user doesn't have enough points to claim this reward";

    await knex.transaction(async (tx) => [
      await tx<IUser>('User')
        .insert({
          id: ctx.options.user,
          points: 0
        })
        .onConflict(['id'])
        .merge({
          points: knex.raw('?? - ?', ['User.points', reward.price])
        }),
      await tx<IUserReward>('UserReward')
        .where({
          rewardId: ctx.options.reward,
          userId: ctx.options.user
        })
        .update({
          pending: false
        })
    ]);

    return `<@${ctx.options.user}> Reward confirmed`;
  }
}
