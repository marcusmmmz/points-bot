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
    let headers = {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)'
    };

    let req = await fetch(`https://discord.com/api/v10/guilds/${ctx.guildID}/members?limit=1000`, { headers });

    let members: Member[] = await req.json();

    let membersWithRole = members.filter((member) => member.roles.some((role) => role == ctx.options.role));

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
