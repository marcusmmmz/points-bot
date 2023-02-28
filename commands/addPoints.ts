import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'adicionar',
      description: 'Dá pontos a um usuário',
      options: [
        {
          type: CommandOptionType.USER,
          name: 'user',
          description: 'Usuário que vai receber os pontos'
        },
        {
          type: CommandOptionType.INTEGER,
          name: 'amount',
          description: 'Quantidade de pontos'
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
          increment: ctx.options.amount
        }
      }
    });

    return `${ctx.options.amount} pontos adicionados ao usuário ${ctx.options.user}`;
  }
}
