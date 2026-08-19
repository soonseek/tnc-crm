# Railway 배포 실행서

현재 배포 단위는 실제 저장 기능이 연결된 `Web`과 `API`다. `Worker`와 `Cron`은 이메일 알림·누락 복구가 구현되는 MVP 후속 묶음에서 독립 서비스로 추가한다. 빈 프로세스를 먼저 배포하지 않는다.

## 1. Railway 최초 설정

스테이징과 운영은 같은 프로젝트의 별도 Railway Environment로 만든다.

1. Railway 프로젝트에 `staging`, `production` Environment를 만든다.
2. 각 Environment에 PostgreSQL을 하나씩 추가한다.
3. GitHub 소스를 직접 연결하지 않은 빈 `tnc-crm-api`, `tnc-crm-web` 서비스를 만든다.
4. API 서비스의 Config as Code 경로를 `/deploy/railway/api.json`으로 설정한다.
5. Web 서비스의 Config as Code 경로를 `/deploy/railway/web.json`으로 설정한다.
6. 두 서비스에 Public Domain을 발급한다.

두 설정 파일은 Railpack 빌드, 싱가포르 단일 replica, 상태 점검, 재시작, 무중단 교체 시간을 고정한다. API는 새 버전을 시작하기 전에 PostgreSQL 마이그레이션을 실행한다.

Railway의 GitHub 직접 자동 배포는 사용하지 않는다. GitHub Actions가 검증과 배포를 한 흐름으로 관리하며, 두 경로가 동시에 실행되어 중복 배포되는 상황을 막는다.

## 2. Railway 환경 변수

### API

```text
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_POOL_SIZE=10
WEB_ORIGIN=https://<web-domain>
```

### Web

```text
CRM_API_BASE_URL=https://<api-domain>/api/v1
NEXT_PUBLIC_CRM_API_BASE_URL=https://<api-domain>/api/v1
```

`NEXT_PUBLIC_CRM_API_BASE_URL`은 브라우저 번들 빌드 시 포함되므로 API 도메인 변경 뒤에는 Web을 다시 배포한다. 비밀 값은 저장소나 `.env.example`에 넣지 않는다.

## 3. GitHub Environment

GitHub 저장소에 `staging`, `production` Environment를 만든다. `production`에는 Required reviewer를 지정해 `main` 배포가 사람 승인 뒤에만 시작되게 한다.

각 Environment에 다음 값을 설정한다.

### Secret

- `RAILWAY_TOKEN`: 해당 Railway Environment에 범위가 제한된 Project Token

### Variables

- 저장소 공통 변수 `RAILWAY_DEPLOY_ENABLED`: Railway 연결 전에는 비워두고, 스테이징 준비가 끝나면 `true`
- `RAILWAY_ENVIRONMENT`: `staging` 또는 `production`
- `RAILWAY_API_SERVICE`: `tnc-crm-api`
- `RAILWAY_WEB_SERVICE`: `tnc-crm-web`
- `API_PUBLIC_URL`: 끝 `/`가 없는 API 공개 주소
- `WEB_PUBLIC_URL`: 끝 `/`가 없는 Web 공개 주소

## 4. 배포 흐름

- Pull Request: PostgreSQL 16 임시 DB에 마이그레이션하고 lint, typecheck, 단위 테스트, 프로덕션 빌드, 실제 API 연결 Playwright 검사를 수행한다.
- `develop`: 검사가 모두 통과하면 `staging`에 API → 상태 점검 → Web → 상태 점검 순으로 자동 배포한다.
- `main`: 검사가 모두 통과하고 GitHub `production` 승인자가 승인하면 같은 순서로 운영 배포한다.
- API 마이그레이션이나 Railway 상태 점검이 실패하면 이후 Web 배포를 실행하지 않는다.

## 5. 장애와 되돌리기

1. GitHub Actions의 `api.log`, Playwright trace, 화면 캡처를 먼저 확인한다.
2. 애플리케이션 배포 실패는 Railway의 직전 성공 Deployment로 Rollback한다.
3. DB 마이그레이션은 자동 역실행하지 않는다. 호환 가능한 추가형 변경을 기본으로 하고 데이터 복구가 필요한 변경은 백업 확인 후 별도 복구 절차로 실행한다.
4. 운영 배포 전 스테이징에서 신규 상담 등록 → 첫 연락 완료 → 상태 갱신을 검수한다.

## 6. 현재 staging 상태 (2026-08-19)

- 공개 저장소: `https://github.com/soonseek/tnc-crm`
- Web: `https://tnc-crm-web-staging.up.railway.app`
- API: `https://tnc-crm-api-staging.up.railway.app`
- API 상태 점검: `/api/v1/health`에서 PostgreSQL `ready: true` 확인
- Web 상태 점검: `/`에서 HTTP 200과 `트루노스크루 CRM` 문서 제목 확인
- Web → API CORS: staging Web origin 허용 확인
- GitHub Environment: `staging`, `production` 생성 완료
- staging GitHub Variables: Railway 환경·서비스명·공개 URL 등록 완료
- 저장소 변수 `RAILWAY_DEPLOY_ENABLED`: `false`
- Railway `production`: 검수 승인 전까지 빈 Environment로 유지
- Railway 서비스의 GitHub 직접 배포 소스: 중복 배포 방지를 위해 해제

## 7. 아직 필요한 외부 준비

1. GitHub 계정의 Billing 잠금을 해제한다. 현재 공개 저장소에서도 Actions job이 시작되기 전에 계정 단위로 거절된다.
2. Railway 프로젝트의 staging 범위 Project Token을 만들고 GitHub `staging` Environment Secret `RAILWAY_TOKEN`으로 직접 등록한다.
3. 위 두 항목을 확인한 뒤 저장소 변수 `RAILWAY_DEPLOY_ENABLED`를 `true`로 변경하고 `develop` 배포를 재실행한다.
4. 운영 검수 시 Railway `production` 자원과 변수·Secret을 별도로 만들고 Required reviewer를 지정한다.
5. GitHub 저장소의 `develop`, `main` 보호 규칙을 확정한다.

배포 코드는 준비되어 있다. 1~2번은 계정 소유자가 결제 및 비밀값 화면에서 처리해야 하는 1회성 작업이며, 토큰 값은 저장소나 문서에 기록하지 않는다.
