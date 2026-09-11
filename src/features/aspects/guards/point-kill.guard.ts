import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from "@nestjs/common";
import { PointKillService } from "../../../features/point-kill/point-kill.service.ts";

@Injectable({ scope: Scope.REQUEST })
export class PointKillGuard implements CanActivate {
  constructor(private readonly pointKillService: PointKillService) {}

  async canActivate(_context: ExecutionContext) {
    await this.pointKillService.assertRequestAllowed();
    return true;
  }
}
