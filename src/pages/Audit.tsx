import SimpleLayout from "@/components/layout/SimpleLayout";
import { AuditHero, AuditPainSection, AuditLossScale } from "@/components/audit/AuditTopSections";
import { AuditDeliverables, AuditProcess, AuditSpeed, AuditBeforeAfter } from "@/components/audit/AuditMiddleSections";
import { AuditForWhom, AuditAfterActions, AuditPricing, AuditFormSection, AuditClosing } from "@/components/audit/AuditBottomSections";

export default function Audit() {
  return (
    <SimpleLayout>
      <div className="font-body" style={{ color: "hsl(210, 40%, 96%)", minHeight: "100vh" }}>
        <AuditHero />
        <AuditPainSection />
        <AuditLossScale />
        <AuditDeliverables />
        <AuditProcess />
        <AuditSpeed />
        <AuditBeforeAfter />
        <AuditForWhom />
        <AuditAfterActions />
        <AuditPricing />
        <AuditFormSection />
        <AuditClosing />
      </div>
    </SimpleLayout>
  );
}
