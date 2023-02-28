import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'adicionar',
      description: 'Remove pontos de um usuário',
      options: [
        {
          type: CommandOptionType.USER,
          name: 'user',
          description: 'Usuário que vai perder pontos',
          required: true
        },
        {
          type: CommandOptionType.INTEGER,
          name: 'amount',
          description: 'Quantidade de pontos',
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

    return `${ctx.options.amount} pontos removidos do usuário <@${ctx.options.user}>`;
  }
}
