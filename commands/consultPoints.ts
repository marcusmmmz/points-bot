import { SlashCommand, SlashCreator, CommandContext } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'consultar',
      description: "Consult a user's points"
    });
  }

  async run(ctx: CommandContext) {
    const user = await prisma.user.findUnique({
      where: { id: ctx.user.id }
    });

    return `You have ${user?.points ?? 0} points`;
  }
}
