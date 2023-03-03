import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'remove',
      description: 'Removes points from a user',
      options: [
        {
          type: CommandOptionType.USER,
          name: 'user',
          description: 'User that will lose points',
          required: true
        },
        {
          type: CommandOptionType.INTEGER,
          name: 'amount',
          description: 'Amount of points',
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    await prisma.user.upsert({
      where: { id: ctx.options.user },
      create: {
        id: ctx.options.user,
        points: ctx.options.amount
      },
      update: {
        points: {
          decrement: ctx.options.amount
        }
      }
    });

    return `<@${ctx.options.user}> lost ${ctx.options.amount} points`;
  }
}
