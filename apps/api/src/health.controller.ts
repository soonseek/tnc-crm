import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { DealsService } from "./deals/deals.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  @ApiOkResponse({ description: "API와 저장소 준비 상태" })
  async health() {
    const storage = await this.dealsService.health();
    return {
      status: "ok",
      service: "tnc-crm-api",
      version: "0.1.0",
      storage,
      checkedAt: new Date().toISOString(),
    };
  }
}
