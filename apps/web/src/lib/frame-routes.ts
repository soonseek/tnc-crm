export type FrameRoute = {
  section: string;
  title: string;
  path: string;
  goal: string;
};

export const frameRoutes: FrameRoute[] = [
  { section: "접근", title: "Google 로그인", path: "/login", goal: "회사 계정으로 안전하게 시작한다." },
  { section: "할 일", title: "오늘 할 일", path: "/", goal: "지금 처리할 업무를 빠짐없이 실행한다." },
  { section: "할 일", title: "알림", path: "/notifications", goal: "놓친 업무와 시스템 알림을 확인한다." },
  { section: "할 일", title: "기한 초과", path: "/tasks/overdue", goal: "기한을 넘긴 행동을 먼저 처리한다." },
  { section: "할 일", title: "오늘 예정", path: "/tasks/today", goal: "오늘 예정된 영업 행동을 확인한다." },
  { section: "할 일", title: "신규 접수", path: "/tasks/new", goal: "새 문의의 유효성을 판단하고 연락한다." },
  { section: "할 일", title: "위임받은 건", path: "/tasks/delegated", goal: "전달받은 영업 건을 이어서 처리한다." },
  { section: "할 일", title: "견적 후 재연락", path: "/tasks/quote-followup", goal: "견적 발송 뒤 멈춘 건에 다시 연락한다." },
  { section: "할 일", title: "계산서 발행 예정", path: "/tasks/invoice", goal: "발행 예정 계산서를 제때 처리한다." },
  { section: "할 일", title: "미수금 확인", path: "/tasks/receivables", goal: "입금 지연 건을 확인하고 기록한다." },
  { section: "영업", title: "영업판", path: "/pipeline", goal: "단계별 분포와 정체 건을 파악한다." },
  { section: "영업", title: "영업판 필터", path: "/pipeline/filter", goal: "담당자·단계·서비스 조건으로 영업 건을 좁힌다." },
  { section: "영업", title: "영업 건 직접 추가", path: "/deals/new", goal: "외부 유입 영업 건을 빠르게 등록한다." },
  { section: "영업", title: "영업 건 상세", path: "/deals/hanbit-mobility", goal: "고객 맥락과 다음 행동을 한곳에서 확인한다." },
  { section: "영업", title: "영업 정보 수정", path: "/deals/hanbit-mobility/edit", goal: "연락처와 상담 정보를 최신화한다." },
  { section: "영업", title: "활동 기록", path: "/deals/hanbit-mobility/activity", goal: "전화·문자·미팅 결과를 기록한다." },
  { section: "영업", title: "다음 행동 추가", path: "/deals/hanbit-mobility/next-action", goal: "후속 행동과 기한을 명확히 등록한다." },
  { section: "영업", title: "담당자 위임", path: "/deals/hanbit-mobility/delegate", goal: "맥락을 보존하며 담당자를 변경한다." },
  { section: "영업", title: "상태 변경", path: "/deals/hanbit-mobility/status", goal: "큰 단계와 세부 상태를 변경한다." },
  { section: "영업", title: "서비스·추산 가치", path: "/deals/hanbit-mobility/services", goal: "서비스별 기회 금액과 예상 계약 월을 관리한다." },
  { section: "영업", title: "문서 관리", path: "/deals/hanbit-mobility/documents", goal: "견적서·제안서·계약서 링크를 관리한다." },
  { section: "영업", title: "변경 이력", path: "/deals/hanbit-mobility/history", goal: "영업 건의 모든 변경 내역을 추적한다." },
  { section: "회사", title: "회사 검색", path: "/companies", goal: "회사별 전체 영업 이력을 찾는다." },
  { section: "회사", title: "회사 상세", path: "/companies/hanbit-mobility", goal: "회사 정보와 전체 영업·계약 관계를 확인한다." },
  { section: "회사", title: "회사 정보 수정", path: "/companies/hanbit-mobility/edit", goal: "규모·PM·투입 인력을 관리한다." },
  { section: "계약·청구", title: "계약·청구", path: "/billing", goal: "발행·입금·미수금 업무를 놓치지 않는다." },
  { section: "계약·청구", title: "계약 등록", path: "/contracts/new", goal: "서비스별 계약 금액과 청구 계획을 등록한다." },
  { section: "계약·청구", title: "계약 상세", path: "/contracts/dawon-group", goal: "계약 금액과 청구 진행 상황을 확인한다." },
  { section: "계약·청구", title: "계약 수정", path: "/contracts/dawon-group/edit", goal: "계약과 서비스별 금액을 정정한다." },
  { section: "계약·청구", title: "청구 일정 추가", path: "/contracts/dawon-group/invoices/new", goal: "선금·중도금·잔금 일정을 등록한다." },
  { section: "계약·청구", title: "계산서 상세", path: "/invoices/invoice-1", goal: "계산서 발행과 입금 상태를 확인한다." },
  { section: "계약·청구", title: "입금 기록", path: "/invoices/invoice-1/payment", goal: "실제 입금일과 금액을 기록한다." },
  { section: "계약·청구", title: "수정·취소·환불", path: "/invoices/invoice-1/adjustment", goal: "재무 변경 사유와 승인 요청을 기록한다." },
  { section: "성과", title: "성과", path: "/performance", goal: "예상 수주·발행·입금을 구분해 판단한다." },
  { section: "승인", title: "승인 대기", path: "/approvals", goal: "AI와 사용자의 중요 변경 요청을 검토한다." },
  { section: "승인", title: "승인 요청 상세", path: "/approvals/approval-1", goal: "변경 전후를 비교하고 승인 여부를 결정한다." },
  { section: "관리", title: "관리", path: "/more", goal: "운영 기준과 보조 정보를 찾는다." },
  { section: "관리", title: "종료·제외 상담", path: "/more/excluded", goal: "보류·실패·제외 건을 재검토한다." },
  { section: "관리", title: "전체 감사 기록", path: "/more/audit", goal: "사용자·AI·자동화 변경을 추적한다." },
  { section: "관리", title: "사용자·권한", path: "/more/users", goal: "관리자·열람자 권한을 관리한다." },
  { section: "관리", title: "휴가·자동 위임", path: "/more/vacations", goal: "휴가 기간과 대체 담당자를 등록한다." },
  { section: "관리", title: "AI 서비스 계정", path: "/more/ai", goal: "AI 권한과 승인 정책을 관리한다." },
  { section: "관리", title: "외부 연동", path: "/more/integrations", goal: "Emergent·Google·Webhook 연결 상태를 관리한다." },
  { section: "관리", title: "서비스·성공 확률", path: "/more/services", goal: "상품과 단계별 기본 확률을 관리한다." },
  { section: "관리", title: "안정성·실패 보관함", path: "/more/reliability", goal: "실패 작업·백업·장애 알림을 관리한다." },
  { section: "검수", title: "전체 화면 검수", path: "/frames", goal: "모든 프레임 목업을 순서대로 검수한다." },
];

export const frameSections = Array.from(new Set(frameRoutes.map((route) => route.section)));
