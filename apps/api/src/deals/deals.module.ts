import { Module } from "@nestjs/common";

import { dealRepositoryProvider } from "./deal-repository.provider";
import { DealsController } from "./deals.controller";
import { DealsService } from "./deals.service";

@Module({
  controllers: [DealsController],
  providers: [dealRepositoryProvider, DealsService],
  exports: [DealsService],
})
export class DealsModule {}
