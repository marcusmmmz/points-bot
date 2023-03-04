import { SlashCommand, SlashCreator, CommandContext } from 'slash-create';
import { IReward, knex } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'rewards',
      description: 'Lists all rewards'
    });
  }

  async run(ctx: CommandContext) {
    const rewards = await knex<IReward>('Reward').orderBy('id', 'asc');

    if (rewards.length == 0) return 'There are no rewards';

    return 'rewards: \n' + rewards.map((reward) => `${reward.item} (id ${reward.id}): ${reward.price}MP`).join('\n');
  }
}
