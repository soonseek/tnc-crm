import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  app.enableCors({
    origin: process.env.WEB_ORIGIN?.split(",").map((origin) => origin.trim()) ?? true,
    credentials: true,
  });
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle("트루노스크루 CRM API")
    .setDescription("신규 문의, 첫 연락, 다음 행동을 관리하는 CRM API")
    .setVersion("1.0")
    .addTag("health")
    .addTag("deals")
    .build();
  const openApiDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, openApiDocument, {
    jsonDocumentUrl: "api/docs/openapi.json",
  });

  await app.listen(Number(process.env.PORT ?? 3002), "0.0.0.0");
}

void bootstrap();
