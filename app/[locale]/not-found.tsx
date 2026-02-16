import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';

export default function LocaleNotFound() {
  const t = useTranslations('notFound');

  return (
    <Section>
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="mb-8">
            {t('description')}
          </p>
          <Button asChild className="not-prose mt-6">
            <Link href="/">{t('returnHome')}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
