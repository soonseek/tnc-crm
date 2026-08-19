# Railway 배포 실행서

GitHub 계정의 Billing 제한으로 GitHub Actions job을 실행할 수 없다. production API·Web은 Railway GitHub 소스로 `main`에 직접 연결하고, PR 확인 병합을 운영 승인점으로 사용한다. staging은 Railway CLI 수동 배포를 유지한다.

현재 배포 단위는 실제 저장 기능이 연결된 `Web`과 `API`다. `Worker`와 `Cron`은 이메일 알림·누락 복구 코드가 구현될 때 독립 서비스로 추가한다.

## 1. 환경 원칙

- `staging`과 `production`은 같은 Railway 프로젝트 안의 별도 Environment다.
- 두 환경은 PostgreSQL·변수·배포 이력을 공유하지 않는다.
- production API·Web은 `soonseek/tnc-crm`의 `main` 브랜치에 직접 연결한다.
- staging은 GitHub 소스를 연결하지 않고 Railway CLI로 배포한다.
- production은 `main`에 병합된 커밋만 자동 배포한다.
- 인증 전 임시 운영 배포에서는 실제 고객 데이터를 입력하지 않는다.

## 2. 현재 운영 인프라 상태 (2026-08-19)

| 자원 | 이름 | 상태 |
| --- | --- | --- |
| Railway Environment | `production` | 생성·격리 완료 |
| PostgreSQL 18 | `Postgres-7I-m` | 실행 중, 전용 50GB 볼륨 READY, 공개 URL 없음 |
| API | `tnc-crm-api-production` | 임시 운영 배포 SUCCESS, PostgreSQL 연결 정상 |
| Web | `tnc-crm-web-production` | 임시 운영 배포 SUCCESS, HTTP 200 |

현재 임시 운영 주소는 다음과 같다.

- API: `https://tnc-crm-api-production-production.up.railway.app`
- Web: `https://tnc-crm-web-production-production.up.railway.app`

API에는 `/deploy/railway/api.json`, Web에는 `/deploy/railway/web.json`을 Config as Code 경로로 지정했다. 두 파일은 Railpack 빌드, 싱가포르 단일 replica, 상태 점검, 재시작 정책과 무중단 교체 시간을 고정한다. API는 새 버전 시작 전에 PostgreSQL 마이그레이션을 실행한다.

## 3. 운영 환경 변수

### API

```text
NODE_ENV=production
DATABASE_URL=${{Postgres-7I-m.DATABASE_URL}}
DATABASE_POOL_SIZE=10
WEB_ORIGIN=https://tnc-crm-web-production-production.up.railway.app
```

### Web

```text
CRM_API_BASE_URL=https://tnc-crm-api-production-production.up.railway.app/api/v1
NEXT_PUBLIC_CRM_API_BASE_URL=https://tnc-crm-api-production-production.up.railway.app/api/v1
CRM_DEPLOYMENT_ENV=production
```

staging Web에는 `CRM_DEPLOYMENT_ENV=staging`을 설정하고, 로컬은 값이 없더라도 `local`로 동작한다. 이 값에 따라 할 일 화면 GNB의 환경 라벨과 영업 건 추가 버튼이 로컬 `LOCAL`·짙은 회색, staging `STAGING`·노란색, production `PRODUCTION`·코발트 파란색으로 표시된다.

위 키는 production에 설정했다. 비밀 값은 저장소와 문서에 기록하지 않는다. `NEXT_PUBLIC_CRM_API_BASE_URL`은 브라우저 번들에 포함되므로 API 주소 변경 뒤에는 Web을 다시 배포한다.

## 4. 임시 운영 제한과 정식 전환 게이트

사용자 승인에 따라 2026-08-19 무인증 임시 운영 배포를 실행했다. 운영 DB는 0건이며 실제 고객 데이터 입력은 금지한다. 다음 항목이 모두 완료된 뒤 정식 운영으로 전환한다.

1. Google Workspace 실제 로그인, 허용 도메인, 관리자·열람자 권한을 구현하고 스테이징에서 검수한다.
2. 미인증 사용자가 영업·재무·관리 URL과 API를 읽거나 쓸 수 없음을 검수한다.
3. Emergent 서명 검증과 원본 ID 중복 방지를 검수한다.
4. production PostgreSQL의 예약 백업을 활성화하고 최초 백업 성공을 확인한다.
5. 신규 상담 등록 → 첫 연락 완료 → 상태 갱신을 staging에서 다시 검수한다.
6. 사용자가 정식 운영 전환을 명시적으로 승인한다.

현재 1~3번은 구현 전이다. URL을 알고 있는 누구나 접근할 수 있으므로 검수 용도로만 사용한다.

## 5. GitHub main 직접 배포 절차

### 5.1 릴리스 후보 검증

```powershell
git switch develop
git pull --ff-only
git status --short
git log -1 --oneline
```

`git status --short` 출력이 없어야 한다. 검증 중인 커밋 해시를 PR에 남긴다.

### 5.2 로컬 검증

```powershell
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

모두 성공해야 한다. 같은 커밋을 staging에 배포하고 실제 API 연결 E2E 및 사용자 검수를 통과시킨 뒤 `main` 대상 PR을 확인 병합한다.

### 5.3 운영 자동 배포

PR이 `main`에 병합되면 Railway가 production API·Web의 watch pattern을 평가해 관련 서비스를 자동 배포한다. 공용 계약 변경은 API와 Web을 모두 배포하고, API pre-deploy 마이그레이션과 각 서비스 상태 점검은 Config as Code 설정을 따른다.

```powershell
Invoke-RestMethod https://tnc-crm-api-production-production.up.railway.app/api/v1/health
Invoke-WebRequest https://tnc-crm-web-production-production.up.railway.app/ -UseBasicParsing
```

API 상태 응답에서 PostgreSQL `ready: true`, Web HTTP 200, Railway Deployment의 branch와 commit hash가 병합 커밋과 일치하는지 확인한다. 자동 배포가 시작되지 않았을 때만 `railway redeploy --from-source`를 복구 수단으로 사용한다.

## 6. 백업과 복구

PostgreSQL은 production 전용 볼륨을 사용하고 외부 공개 URL을 발급하지 않았다. Railway CLI에는 예약 백업을 설정하는 명령이 없으므로 다음 1회성 작업은 Railway 대시보드에서 수행한다.

1. `tnc-crm` → `production` → `Postgres-7I-m` → `Backups`를 연다.
2. 일일 예약 백업을 켜고 최소 하루치 복구 지점을 확보한다.
3. 요금제에서 허용하면 주간·월간 보관도 함께 설정한다.
4. 최초 성공 시각을 운영 기록에 남긴다.
5. 분기마다 별도 복원 환경에서 복원 시험을 실행한다.

목표는 최대 중단 반나절, 최대 데이터 손실 하루다. 스키마 변경은 가능한 한 이전 버전과 호환되는 추가형으로 만들고, 마이그레이션을 자동 역실행하지 않는다.

## 7. 장애와 되돌리기

1. Railway의 API 빌드·pre-deploy·runtime 로그를 먼저 확인한다.
2. API 마이그레이션 또는 상태 점검이 실패하면 Web을 배포하지 않는다.
3. 애플리케이션 장애는 Railway에서 직전 성공 Deployment로 Rollback한다.
4. 데이터 복구는 정상 백업과 복원 대상 시점을 확인한 뒤 별도 환경에서 먼저 검증한다.
5. 배포 커밋, 실행자, 시각, 검증 결과, 되돌림 여부를 계속 보관한다.

## 8. staging 상태

- Web: `https://tnc-crm-web-staging.up.railway.app`
- API: `https://tnc-crm-api-staging.up.railway.app`
- PostgreSQL 연결 상태 점검과 Web → API CORS 검수 완료
- 실제 UUID의 연락 기록 화면 500 오류 수정 및 사용자 재검수 완료
- Railway 서비스의 GitHub 직접 소스 연결 해제

## 9. GitHub의 역할

GitHub는 코드 이력과 `develop`·`main` 릴리스 기준점으로 사용한다. production API·Web만 Railway에서 `main`에 직접 연결하고 staging은 수동 배포한다. Billing 제한으로 `.github/workflows/ci.yml`은 수동 참조용으로만 남긴다. 추후 GitHub Actions가 다시 가능해지면 production 배포 책임을 Railway 직접 연결과 Actions 중 하나로 다시 통일한다.
