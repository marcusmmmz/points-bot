import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'rewards',
      description: 'Lists all rewards'
    });
  }

  async run(ctx: CommandContext) {
    const rewards = await prisma.reward.findMany({ select: { id: true, item: true } });

    if (rewards.length == 0) return 'There are no rewards';

    return 'rewards: \n' + rewards.map((reward) => `${reward.item} (${reward.id})`).join('\n');
  }
}
