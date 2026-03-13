import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
import { PagePrivacy } from "@/components/sections/PagePrivacy";

export default function Privacy() {
  return (
    <div style={{ background: "#f8f8f6", minHeight: "100vh", fontFamily: "Montserrat, sans-serif" }}>
      <DokNavbar />
      <div style={{ paddingTop: 80 }}>
        <PagePrivacy />
      </div>
      <DokFooter />
    </div>
  );
}
