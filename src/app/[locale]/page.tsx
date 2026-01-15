import { getDictionary, type Locale } from "@/lib/i18n";
import HomeHero from "@/components/HomeHero";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <HomeHero dict={dict} locale={locale} />;
}
