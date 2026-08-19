import type { Provider } from "@nestjs/common";
import { Pool } from "pg";

import { DEAL_REPOSITORY } from "./deal.repository";
import { InMemoryDealRepository } from "./in-memory-deal.repository";
import { PgDealRepository } from "./pg-deal.repository";

export const dealRepositoryProvider: Provider = {
  provide: DEAL_REPOSITORY,
  useFactory: () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      return new PgDealRepository(
        new Pool({
          connectionString: databaseUrl,
          max: Number(process.env.DATABASE_POOL_SIZE ?? 10),
          idleTimeoutMillis: 30_000,
        }),
      );
    }

    if (process.env.NODE_ENV === "production") {
      throw new Error("운영 환경에는 DATABASE_URL이 반드시 필요합니다.");
    }

    return new InMemoryDealRepository();
  },
};
