import { Reward } from '@prisma/client';
import { SlashCommand, SlashCreator, CommandContext } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'rewards',
      description: 'Lists all rewards'
    });
  }

  async run(ctx: CommandContext) {
    // findMany isn't working for some reason
    const rewards: Reward[] = await prisma.$queryRaw`SELECT * FROM Reward ORDER BY id ASC`;

    if (rewards.length == 0) return 'There are no rewards';

    return 'rewards: \n' + rewards.map((reward) => `${reward.item} (${reward.id})`).join('\n');
  }
}
