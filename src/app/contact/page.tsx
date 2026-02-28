import { ContactForm } from "@/components/contact/ContactForm";
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n";
import { cookies } from "next/headers";

export default async function ContactPage() {
    const cookieStore = await cookies();
    const locale = (cookieStore.get("NEXT_LOCALE")?.value || "EN") as Locale;
    const config = await getSiteConfig();
    const t = getTexts(config, locale);

    return <ContactForm t={t} />;
}
