import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { IReward, knex } from '../db';

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
    const reward = (await knex<IReward>('Reward').where('id', ctx.options.id).delete().returning(['item']))[0];

    return `${reward.item} reward was deleted`;
  }
}
