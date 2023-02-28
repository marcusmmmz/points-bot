import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'consultar',
      description: 'Consulta os pontos de um usuário',
      options: [
        {
          type: CommandOptionType.USER,
          name: 'user',
          description: 'Usuário a ser consultado'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const user = await prisma.user.findUnique({
      where: { id: ctx.options.user ?? ctx.user.id }
    });

    const points = user?.points ?? 0;

    if (ctx.options.user) return `<@${ctx.options.user}> tem ${points} pontos`;
    else return `Você tem ${points} pontos`;
  }
}
