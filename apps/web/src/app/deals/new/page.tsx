import { NewDealForm } from "@/components/new-deal-form";
import { ScreenHeader } from "@/components/screen-header";

export default function NewDealPage() {
  return (
    <>
      <ScreenHeader
        title="영업 건 직접 추가"
        description="전화·소개 등 외부 유입"
        backHref="/"
      />
      <div className="px-4 py-5">
        <NewDealForm />
      </div>
    </>
  );
}

