# Railway 배포 실행서

현재 배포 단위는 실제 저장 기능이 연결된 `Web`과 `API`다. `Worker`와 `Cron`은 이메일 알림·누락 복구가 구현되는 MVP 후속 묶음에서 독립 서비스로 추가한다. 빈 프로세스를 먼저 배포하지 않는다.

## 1. Railway 최초 설정

스테이징과 운영은 같은 프로젝트의 별도 Railway Environment로 만든다.

1. Railway 프로젝트에 `staging`, `production` Environment를 만든다.
2. 각 Environment에 PostgreSQL을 하나씩 추가한다.
3. 같은 GitHub 저장소를 소스로 하는 `tnc-crm-api`, `tnc-crm-web` 서비스를 만든다.
4. API 서비스의 Config as Code 경로를 `/deploy/railway/api.json`으로 설정한다.
5. Web 서비스의 Config as Code 경로를 `/deploy/railway/web.json`으로 설정한다.
6. 두 서비스에 Public Domain을 발급한다.

두 설정 파일은 Railpack 빌드, 싱가포르 단일 replica, 상태 점검, 재시작, 무중단 교체 시간을 고정한다. API는 새 버전을 시작하기 전에 PostgreSQL 마이그레이션을 실행한다.

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

## 6. 아직 필요한 외부 준비

- Railway 프로젝트·Environment·PostgreSQL·서비스 생성
- Railway 도메인 확정
- GitHub Environment, 승인자, Secret·Variables 등록
- GitHub 저장소의 `develop`, `main` 보호 규칙 설정

이 네 항목은 계정 소유자의 외부 권한이 필요한 1회성 작업이다. 코드와 파이프라인은 값이 등록되는 즉시 실행되도록 구성돼 있다.
