import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
import { PageOffer } from "@/components/sections/PageOffer";

export default function Offer() {
  return (
    <div style={{ background: "#f8f8f6", minHeight: "100vh", fontFamily: "Montserrat, sans-serif" }}>
      <DokNavbar />
      <div style={{ paddingTop: 80 }}>
        <PageOffer />
      </div>
      <DokFooter />
    </div>
  );
}
