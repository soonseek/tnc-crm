import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { frameRoutes, frameSections } from "../../src/lib/frame-routes";

const artifactDir = path.resolve(process.cwd(), "../../artifacts");
const frameArtifactDir = path.join(artifactDir, "frames");

fs.mkdirSync(frameArtifactDir, { recursive: true });

test("home frame exposes the priority workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".theme-professional-cobalt.theme-restrained-glass")).toHaveCount(1);
  await expect(page.getByText("FRAME MOCKUP", { exact: false })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "오늘 할 일" })).toBeVisible();
  await expect(page.getByText("먼저 처리하세요")).toBeVisible();
  await expect(
    page.getByText("전사 리더 80명 대상 AX 업무혁신 집합교육 문의"),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "영업판" }),
  ).toBeVisible();

  await page.screenshot({
    path: path.join(artifactDir, "frame-home-mobile.png"),
    fullPage: false,
  });
});

test("primary frames are reachable from mobile navigation", async ({ page }) => {
  const routes = [
    ["/pipeline", "영업판"],
    ["/billing", "계약·청구"],
    ["/performance", "성과"],
    ["/more", "관리"],
    ["/companies", "회사 검색"],
    ["/deals/new", "영업 건 직접 추가"],
    ["/deals/hanbit-mobility", "한빛모빌리티"],
  ] as const;

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveText(heading);
  }

  await page.goto("/pipeline");
  const selectedStage = page.locator("[data-surface='solid']").first();
  await expect(selectedStage).toBeVisible();
  const selectedStageColors = await selectedStage.evaluate((element) => {
    const styles = getComputedStyle(element);
    return { background: styles.backgroundColor, foreground: styles.color };
  });
  expect(selectedStageColors.background).not.toBe(selectedStageColors.foreground);
  await page.screenshot({
    path: path.join(artifactDir, "frame-pipeline-mobile.png"),
    fullPage: false,
  });
});

test("UI decision review exposes six global rules", async ({ page }) => {
  await page.goto("/ui-decisions");

  await expect(page.getByRole("heading", { name: "UI 의사결정" })).toBeVisible();
  for (const heading of [
    "정보 밀도",
    "저장 방식",
    "화면 전환",
    "행동 버튼 위계",
    "상태 피드백",
    "금액·날짜 표현",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
  await expect(page.getByText("A · 여유형 카드")).toBeVisible();
  await expect(page.getByText("B · 압축형 목록")).toBeVisible();
  await expect(page.getByText("A · 중요 입력은 명시적 저장")).toBeVisible();
  await expect(page.getByText("혼합 규칙", { exact: true })).toBeVisible();

  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(overflow.content).toBeLessThanOrEqual(overflow.viewport + 1);

  await page.screenshot({
    path: path.join(artifactDir, "ui-decisions-mobile.png"),
    fullPage: true,
  });
});

test("restrained cobalt glass theme applies brand and glass tokens", async ({ page }) => {
  await page.goto("/theme-preview");

  await expect(page.getByRole("heading", { name: "트루노스크루 CRM" })).toBeVisible();
  await expect(page.getByText("절제형 코발트 글래스")).toBeVisible();
  await expect(page.getByText("오늘의 영업 방향을")).toBeVisible();
  await expect(page.getByText("Pretendard Variable", { exact: false })).toBeVisible();
  await expect(page.locator("[data-glass-surface]")).toHaveCount(2);

  const theme = await page.locator(".theme-restrained-glass").evaluate((element) => {
    const styles = getComputedStyle(element);
    const surface = element.querySelector<HTMLElement>("[data-glass-surface='standard']");
    const surfaceStyles = surface ? getComputedStyle(surface) : null;
    return {
      primary: styles.getPropertyValue("--primary").trim(),
      background: styles.getPropertyValue("--background").trim(),
      glassSurface: styles.getPropertyValue("--glass-surface").trim(),
      backdropFilter: surfaceStyles?.backdropFilter ?? "",
      font: styles.fontFamily,
      viewport: window.innerWidth,
      content: document.documentElement.scrollWidth,
    };
  });

  expect(theme.primary.toLowerCase()).toBe("#0047ff");
  expect(theme.background.toLowerCase()).toBe("#f4f5f6");
  expect(theme.glassSurface.toLowerCase()).toBe("#ffffffd1");
  expect(theme.backdropFilter).toContain("blur(18px)");
  expect(theme.font).toContain("Pretendard Variable");
  expect(theme.content).toBeLessThanOrEqual(theme.viewport + 1);

  await page.screenshot({
    path: path.join(artifactDir, "theme-restrained-cobalt-glass-viewport.png"),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(artifactDir, "theme-restrained-cobalt-glass-mobile.png"),
    fullPage: true,
  });
});

test("live MVP flow registers a deal and completes first contact", async ({ page }) => {
  test.setTimeout(60_000);
  test.skip(!process.env.TNC_API_BASE_URL, "실행 중인 CRM API가 필요합니다.");

  const uniqueCompany = `MVP검수기업-${Date.now()}`;
  await page.goto("/deals/new");
  await page.getByLabel("회사명 *").fill(uniqueCompany);
  await page.getByLabel("담당자명 *").fill("김검수");
  await page.getByLabel("직함").fill("인재개발팀장");
  await page.getByLabel("연락처 *").fill("010-9876-5432");
  await page.getByLabel("이메일 *").fill("qa@example.com");
  await page.getByLabel("회사 규모 *").selectOption("51_200");
  await page.getByRole("button", { name: "집합교육" }).click();
  await page.getByLabel("문의 메모").fill("MVP 첫 연락 흐름 자동 검수");
  await page.getByRole("button", { name: "영업 건 등록" }).click();

  await expect(page.getByText("영업 건이 등록됐습니다.")).toBeVisible();
  await page.getByRole("link", { name: "등록한 영업 건 보기" }).click();
  await expect(page.getByRole("heading", { name: uniqueCompany })).toBeVisible();
  await expect(page.getByText("MVP 첫 연락 흐름 자동 검수", { exact: true }).first()).toBeVisible();

  await page.getByRole("link", { name: "첫 연락 기록" }).click();
  await expect(page.getByText("초기 상담 완료", { exact: true })).toBeVisible();
  await page.locator("select[name='outcome']").selectOption("message_left");
  await expect(page.getByText("고객 응답 대기", { exact: true })).toBeVisible();
  await page.locator("textarea[name='summary']").fill("통화 실패 후 문자 발송 완료");
  await page.getByRole("button", { name: "첫 연락 완료 저장" }).click();
  await expect(page.getByText("첫 연락이 완료됐습니다.")).toBeVisible();
  await expect(page.getByText("초기 상담", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("고객 응답 대기", { exact: true }).first()).toBeVisible();

  await page.getByRole("link", { name: "영업 건으로 돌아가기" }).click();
  await expect(page.getByText("고객 응답 확인", { exact: true })).toBeVisible();
  await expect(page.getByText("연락 완료", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "완료", exact: true })).toHaveCount(0);

  await page.screenshot({
    path: path.join(artifactDir, "mvp-first-contact-completed-mobile.png"),
    fullPage: true,
  });
});

test.describe("complete frame inventory", () => {
  for (const section of frameSections) {
    const routes = frameRoutes.filter((route) => route.section === section);

    test(`${section} section renders without mobile overflow`, async ({ page }) => {
      test.setTimeout(120_000);

      for (const route of routes) {
        const response = await page.goto(route.path);
        expect(response?.ok(), `${route.path} should return a successful response`).toBeTruthy();
        await expect(
          page.locator(".theme-professional-cobalt.theme-restrained-glass"),
          `${route.path} should use the confirmed global theme`,
        ).toHaveCount(1);
        await expect(page.locator("h1").first(), `${route.path} should expose a screen title`).toBeVisible();

        const overflow = await page.evaluate(() => ({
          viewport: window.innerWidth,
          content: document.documentElement.scrollWidth,
        }));
        expect(
          overflow.content,
          `${route.path} should not overflow the mobile viewport`,
        ).toBeLessThanOrEqual(overflow.viewport + 1);

        const fileName =
          route.path === "/"
            ? "home.png"
            : `${route.path.slice(1).replaceAll("/", "--")}.png`;
        await page.screenshot({
          path: path.join(frameArtifactDir, fileName),
          fullPage: true,
        });
      }
    });
  }
});
