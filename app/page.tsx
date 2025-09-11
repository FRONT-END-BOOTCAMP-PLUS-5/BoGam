import RootFlow from '@/(anon)/_components/onboarding/RootFlow';
import { mainPageMetadata, getMainPageJsonLd } from '@metadata/mainMetadata';

export const metadata = mainPageMetadata;

export default function Page() {
  const jsonLd = getMainPageJsonLd();
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />
      <RootFlow />
    </>
  );
}
