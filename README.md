# 트루노스크루 CRM

AX 교육·코칭·구축·변화관리 서비스를 위한 모바일 우선 영업 자동화 시스템입니다.

현재 단계는 **6차 구축 및 검수 — MVP 범위 구축**입니다. 확정된 모바일 UI 위에 NestJS API, PostgreSQL, Worker와 Cron을 순차적으로 연결합니다. 첫 MVP 수직 흐름은 신규 문의 접수부터 첫 연락 완료와 다음 행동 추적까지입니다.

1차 수직 흐름은 실제 Web/API로 연결됐고 검수를 통과했습니다. Railway 운영 인프라와 GitHub Actions 없이 승인형으로 배포하는 방법은 [`docs/07-deployment-runbook.md`](docs/07-deployment-runbook.md)에 정리돼 있습니다.

2026-08-19 기준 production에는 무인증 임시 검수 버전이 배포되어 있습니다. Google Workspace 인증과 권한을 구현하기 전까지 실제 고객 데이터는 입력하지 않습니다.

## 실행

```bash
pnpm install
pnpm dev
```

기본 주소는 `http://localhost:3000`입니다.

API는 별도 터미널에서 실행합니다.

```bash
pnpm dev:api
```

API 기본 주소는 `http://localhost:3002/api/v1`입니다. PostgreSQL 연결이 없는 개발 환경에서는 메모리 저장소를 사용합니다.

개발 서버에서 `/frames`를 열면 구현된 전체 프레임 목업 46개를 영역별로 순서대로 검수할 수 있습니다.

## 검증

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 저장소 구조

```text
apps/
  web/       # 현재 구현 중인 모바일 CRM 프론트엔드
  api/       # Railway CRM API 예정 영역
  worker/    # 비동기 작업 Worker 예정 영역
  cron/      # Railway 예약 작업 예정 영역
packages/
  contracts/ # API 계약·공유 타입 예정 영역
docs/        # 인터뷰에서 확정한 제품·시스템 명세
```

## 문서

- [문제 정의](docs/01-problem-definition.md)
- [업무·데이터·상태 정의](docs/02-work-data-state.md)
- [UX·IA 설계](docs/03-ux-ia.md)
- [시스템 구조·기능 명세](docs/04-system-spec.md)
- [UI 디자인 검수 기록](docs/05-ui-design.md)
- [구축·검수 계획과 MVP 범위](docs/06-build-validation.md)
