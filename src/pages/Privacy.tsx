import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
import { PagePrivacy } from "@/components/sections/PagePrivacy";

export default function Privacy() {
  return (
    <div className="dark" style={{ minHeight: "100vh" }}>
      <DokNavbar />
      <div style={{ paddingTop: 80 }}>
        <PagePrivacy />
      </div>
      <DokFooter />
    </div>
  );
}