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
    const rewards = await prisma.reward.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    return rewards.map((reward) => `${reward.item} (${reward.id})`).join('\n');
  }
}