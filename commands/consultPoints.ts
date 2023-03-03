import { SlashCommand, SlashCreator, CommandContext } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'mp',
      description: 'Consult your points'
    });
  }

  async run(ctx: CommandContext) {
    const user = await prisma.user.findUnique({
      where: { id: ctx.user.id }
    });

    return `You have ${user?.points ?? 0} points`;
  }
}
