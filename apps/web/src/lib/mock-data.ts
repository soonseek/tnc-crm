export type Deal = {
  id: string;
  company: string;
  contact: string;
  initialRequest: string;
  status: string;
  stage: string;
  service: string;
  due: string;
  value: string;
  probability: number;
  urgent?: boolean;
  delegated?: boolean;
};

export const deals: Deal[] = [
  {
    id: "hanbit-mobility",
    company: "한빛모빌리티",
    contact: "박서준 인재개발팀장",
    initialRequest: "전사 리더 80명 대상 AX 업무혁신 집합교육 문의",
    status: "1차 연락 대기",
    stage: "신규",
    service: "집합교육",
    due: "오늘 오후 2:30",
    value: "1,800만원",
    probability: 0,
    urgent: true,
  },
  {
    id: "seum-tech",
    company: "세움테크",
    contact: "김하늘 조직문화파트장",
    initialRequest: "교육 이후 현업 적용을 위한 3개월 변화관리 요청",
    status: "고객 응답 대기",
    stage: "초기 상담",
    service: "3개월 변화관리",
    due: "1일 지연",
    value: "3,200만원",
    probability: 5,
    urgent: true,
    delegated: true,
  },
  {
    id: "greenwave",
    company: "그린웨이브",
    contact: "이도윤 HRD 매니저",
    initialRequest: "핵심인재 12명 대상 온라인 AX 실무 코칭 문의",
    status: "미팅 일정 확정",
    stage: "후속 진행",
    service: "온라인 1:1 코칭",
    due: "오늘 오후 4:00",
    value: "2,400만원",
    probability: 10,
  },
  {
    id: "mirae-parts",
    company: "미래정밀",
    contact: "최유진 혁신추진실장",
    initialRequest: "생산·품질 부문의 암묵지를 자산화하는 AX 구축 검토",
    status: "협의 중",
    stage: "제안·협의",
    service: "AX 구축 서비스",
    due: "내일 오전 10:00",
    value: "8,500만원",
    probability: 40,
  },
  {
    id: "dawon-group",
    company: "다원그룹",
    contact: "정민호 교육운영책임",
    initialRequest: "계열사 교육과 후속 변화관리를 결합한 프로그램 요청",
    status: "계약서 서명 완료",
    stage: "계약",
    service: "집합교육 외 1",
    due: "계산서 D-3",
    value: "5,600만원",
    probability: 80,
  },
];

export const pipelineStages = [
  { name: "신규", count: 4, value: "5,100만원" },
  { name: "초기 상담", count: 7, value: "1.2억원" },
  { name: "후속 진행", count: 6, value: "1.8억원" },
  { name: "제안·협의", count: 4, value: "2.4억원" },
  { name: "계약", count: 3, value: "1.1억원" },
];

export const billingItems = [
  {
    id: "invoice-1",
    company: "다원그룹",
    service: "집합교육",
    label: "선금 30%",
    amount: "1,680만원",
    date: "8월 22일",
    status: "발행 예정",
  },
  {
    id: "invoice-2",
    company: "코어링크",
    service: "AX 구축 서비스",
    label: "중도금 40%",
    amount: "3,200만원",
    date: "오늘",
    status: "입금 대기",
  },
  {
    id: "invoice-3",
    company: "브라이트웍스",
    service: "온라인 1:1 코칭",
    label: "잔금 20%",
    amount: "640만원",
    date: "2일 지연",
    status: "미수금",
  },
];
