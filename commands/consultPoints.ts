import { SlashCommand, SlashCreator, CommandContext } from 'slash-create';
import { IUser, knex } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'mp',
      description: 'Consult your MP'
    });
  }

  async run(ctx: CommandContext) {
    const user = await knex<IUser>('User').where('id', ctx.user.id).first();

    return `You have ${user?.points ?? 0}MP`;
  }
}
