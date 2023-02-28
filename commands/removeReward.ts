import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'dreward',
      description: 'Deletes a reward',
      options: [
        {
          type: CommandOptionType.INTEGER,
          name: 'id',
          description: "The reward's id",
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const reward = await prisma.reward.delete({
      where: { id: ctx.options.id }
    });

    return `${reward.item} reward was deleted`;
  }
}
