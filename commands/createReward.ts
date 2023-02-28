import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'creward',
      description: 'Creates a reward',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'item',
          description: "Name of the reward's item",
          required: true
        },
        {
          type: CommandOptionType.INTEGER,
          name: 'price',
          description: 'Price',
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const reward = await prisma.reward.create({
      data: {
        item: ctx.options.item,
        price: ctx.options.price
      }
    });

    return `${ctx.options.item} created with id ${reward.id}`;
  }
}
