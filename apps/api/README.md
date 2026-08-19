# CRM API

Railway에 독립 배포하는 NestJS 기반 REST API입니다.

## 로컬 실행

PostgreSQL 없이 실행하면 개발 전용 메모리 저장소를 사용합니다. `NODE_ENV=production`에서는 `DATABASE_URL`이 없으면 기동하지 않습니다.

```bash
pnpm --filter @tnc-crm/contracts build
pnpm --filter @tnc-crm/api dev
```

- API: `http://localhost:3002/api/v1`
- OpenAPI: `http://localhost:3002/api/docs`
- 상태 점검: `http://localhost:3002/api/v1/health`

## PostgreSQL

```bash
copy apps/api/.env.example apps/api/.env
pnpm --filter @tnc-crm/api db:migrate
```
