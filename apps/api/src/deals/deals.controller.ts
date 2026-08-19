import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import { DealsService } from "./deals.service";

function requireIdempotencyKey(key: string | undefined) {
  if (!key || key.trim().length < 8) {
    throw new BadRequestException("쓰기 요청에는 8자 이상의 Idempotency-Key가 필요합니다.");
  }
  return key.trim();
}

@ApiTags("deals")
@Controller("deals")
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @ApiHeader({ name: "Idempotency-Key", required: true })
  @ApiBody({
    schema: {
      type: "object",
      required: [
        "source",
        "receivedAt",
        "companyName",
        "companySize",
        "contactName",
        "phone",
        "email",
      ],
      properties: {
        source: { type: "object" },
        receivedAt: { type: "string", format: "date-time" },
        companyName: { type: "string" },
        companySize: { type: "string" },
        contactName: { type: "string" },
        contactTitle: { type: "string" },
        phone: { type: "string" },
        email: { type: "string", format: "email" },
        customerNote: { type: "string" },
        services: { type: "array", items: { type: "string" } },
      },
    },
  })
  @ApiCreatedResponse({ description: "신규 영업 건 등록 완료" })
  create(
    @Body() body: unknown,
    @Headers("idempotency-key") idempotencyKey: string | undefined,
  ) {
    return this.dealsService.create(body, requireIdempotencyKey(idempotencyKey));
  }

  @Get()
  @ApiQuery({ name: "cursor", required: false })
  @ApiQuery({ name: "limit", required: false, schema: { type: "integer", minimum: 1, maximum: 100 } })
  @ApiOkResponse({ description: "영업 건 커서 목록" })
  list(
    @Query("cursor") cursor: string | undefined,
    @Query("limit") limit: string | undefined,
  ) {
    const parsedLimit = limit === undefined ? undefined : Number(limit);
    if (parsedLimit !== undefined && !Number.isInteger(parsedLimit)) {
      throw new BadRequestException("limit은 정수여야 합니다.");
    }
    return this.dealsService.list(cursor, parsedLimit);
  }

  @Get(":id")
  @ApiParam({ name: "id", format: "uuid" })
  @ApiOkResponse({ description: "영업 건 상세" })
  findById(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.dealsService.findById(id);
  }

  @Post(":id/first-contact")
  @ApiParam({ name: "id", format: "uuid" })
  @ApiHeader({ name: "Idempotency-Key", required: true })
  @ApiBody({
    schema: {
      type: "object",
      required: ["outcome", "occurredAt"],
      properties: {
        outcome: { type: "string", enum: ["connected", "message_left"] },
        occurredAt: { type: "string", format: "date-time" },
        summary: { type: "string" },
        nextAction: { type: "object" },
      },
    },
  })
  @ApiOkResponse({ description: "첫 연락 완료 및 다음 행동 기록" })
  completeFirstContact(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() body: unknown,
    @Headers("idempotency-key") idempotencyKey: string | undefined,
  ) {
    return this.dealsService.completeFirstContact(
      id,
      body,
      requireIdempotencyKey(idempotencyKey),
    );
  }
}
