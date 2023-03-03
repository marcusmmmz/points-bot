import { SlashCommand, SlashCreator, CommandContext, CommandOptionType } from 'slash-create';
import { prisma } from '../db';

export default class HelloCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'r',
      description: 'Claim a reward',
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
    let [user, reward] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id: ctx.user.id }
      }),
      prisma.reward.findUnique({
        where: { id: ctx.options.id }
      })
    ]);

    if (!reward) return "This reward doesn't exist";

    const points = user?.points ?? 0;

    if (points < reward.price) return "You don't have enough points to claim this reward";

    await prisma.$transaction([
      prisma.user.upsert({
        where: { id: ctx.user.id },
        create: {
          id: ctx.user.id,
          points: 0
        },
        update: {
          points: {
            decrement: reward.price
          }
        }
      }),
      prisma.userReward.create({
        data: {
          rewardId: reward.id,
          userId: ctx.user.id,
          pending: true
        }
      })
    ]);

    return 'Reward successfully claimed';
  }
}
