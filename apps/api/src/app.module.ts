import { Module } from "@nestjs/common";

import { DealsModule } from "./deals/deals.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [DealsModule],
  controllers: [HealthController],
})
export class AppModule {}
