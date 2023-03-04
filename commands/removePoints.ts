import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { knex } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'remove',
      description: 'Removes MP from a user',
      options: [
        {
          type: CommandOptionType.USER,
          name: 'user',
          description: 'User that will lose MP',
          required: true
        },
        {
          type: CommandOptionType.INTEGER,
          name: 'amount',
          description: 'Amount of MP',
          required: true
        }
      ],
      requiredPermissions: ['MODERATE_MEMBERS']
    });
  }

  async run(ctx: CommandContext) {
    await knex('User')
      .insert({
        id: ctx.options.user,
        points: -ctx.options.amount
      })
      .onConflict(['id'])
      .merge({
        points: knex.raw('?? - ?', ['User.points', ctx.options.amount])
      });

    return `<@${ctx.options.user}> lost ${ctx.options.amount}MP`;
  }
}
