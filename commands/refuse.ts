import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { IUserReward, knex } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'refuse',
      description: "Refuse a user's reward",
      options: [
        {
          type: CommandOptionType.USER,
          name: 'user',
          description: "User that won't receive the reward",
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
    await knex<IUserReward>('UserReward')
      .where({
        rewardId: ctx.options.reward,
        userId: ctx.options.user
      })
      .delete();

    return `<@${ctx.options.user}> Reward refused`;
  }
}
