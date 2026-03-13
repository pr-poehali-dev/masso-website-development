import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
import { PageOffer } from "@/components/sections/PageOffer";

export default function Offer() {
  return (
    <div className="dark" style={{ minHeight: "100vh" }}>
      <DokNavbar />
      <div style={{ paddingTop: 80 }}>
        <PageOffer />
      </div>
      <DokFooter />
    </div>
  );
}