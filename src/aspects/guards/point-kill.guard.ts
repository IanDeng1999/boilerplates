import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from "@nestjs/common";
import { PointKillService } from "../../services/point-kill/point-kill.service.js";

@Injectable({ scope: Scope.REQUEST })
export class PointKillGuard implements CanActivate {
  constructor(private readonly pointKillService: PointKillService) {}

  async canActivate(_context: ExecutionContext) {
    await this.pointKillService.assertRequestAllowed();
    return true;
  }
}
