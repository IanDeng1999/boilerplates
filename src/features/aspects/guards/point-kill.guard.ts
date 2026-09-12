import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  SetMetadata,
} from "@nestjs/common";
import { PointKillService } from "../../../features/point-kill/point-kill.service.ts";
import { SKIP_POINT_KILL_KEY } from "./point-kill.const.ts";

export { SKIP_POINT_KILL_KEY } from "./point-kill.const.ts";

export function SkipPointKill() {
  return SetMetadata(SKIP_POINT_KILL_KEY, true);
}

@Injectable({ scope: Scope.REQUEST })
export class PointKillGuard implements CanActivate {
  constructor(private readonly pointKillService: PointKillService) {}

  async canActivate(context: ExecutionContext) {
    if (
      Reflect.getMetadata(SKIP_POINT_KILL_KEY, context.getHandler()) ||
      Reflect.getMetadata(SKIP_POINT_KILL_KEY, context.getClass())
    ) {
      return true;
    }

    await this.pointKillService.assertRequestAllowed();
    return true;
  }
}
