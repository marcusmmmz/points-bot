import { SlashCommand, CommandOptionType, SlashCreator, CommandContext, RequestHandler, Member } from 'slash-create';
import { knex } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'giverole',
      description: 'Gives MP to a role',
      options: [
        {
          type: CommandOptionType.INTEGER,
          name: 'amount',
          description: 'Amount of MP',
          required: true
        },
        {
          type: CommandOptionType.ROLE,
          name: 'role',
          description: 'Role that will get MP or everyone if not specified',
          required: true
        }
      ],
      requiredPermissions: ['MODERATE_MEMBERS']
    });
  }

  async run(ctx: CommandContext) {
    const reqHandler = new RequestHandler(this.creator);

    let members: Member[] = await reqHandler.request('GET', `/guilds/${ctx.guildID}/members?limit=1000`);

    let membersWithRole = members.filter((user) =>
      user.roles.some((role) => role == ctx.options.role.id ?? ctx.options.role)
    );

    await knex('User')
      .insert(
        membersWithRole.map((member) => ({
          id: member.user.id,
          points: 0
        }))
      )
      .onConflict(['id'])
      .ignore();

    await knex.transaction((trx) => {
      const queries = membersWithRole
        .map((member) => ({
          id: member.user.id,
          points: knex.raw('?? + ?', ['User.points', ctx.options.amount])
        }))
        .map((user) => knex('User').where('id', user.id).update(user).transacting(trx));
      return Promise.all(queries).then(trx.commit).catch(trx.rollback);
    });

    return `All users with role <@${ctx.options.role}> received ${ctx.options.amount}MP`;
  }
}
