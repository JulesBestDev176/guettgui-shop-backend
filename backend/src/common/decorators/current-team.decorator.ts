import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentTeam = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const teamMember = request.teamMember;
    return data ? teamMember?.[data] : teamMember;
  },
);
