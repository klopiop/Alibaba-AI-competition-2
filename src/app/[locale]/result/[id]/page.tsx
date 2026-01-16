import { getDictionary, type Locale } from "@/lib/i18n";
import ResultClient from "./ResultClient";

export const generateStaticParams = async () => {
  return [];
}

export default async function ResultPage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  const dict = getDictionary(locale);

  return <ResultClient locale={locale} dict={dict} conversationId={id} />;
}
