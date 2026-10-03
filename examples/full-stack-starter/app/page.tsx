import { EmbedOutlet, LudicordActivity } from "ludicord";
import { AudienceProvider } from "@/components/audience";
import Navbar from "@/components/navbar";
import "./globals.css";

export default function Pages() {
  return (
    <LudicordActivity defaultEmbed="home">
      <AudienceProvider>
        <Navbar />
        <EmbedOutlet />
      </AudienceProvider>
    </LudicordActivity>
  );
}
