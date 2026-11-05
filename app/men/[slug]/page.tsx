import {
  SectionSlug,
  sectionSlugMetadata,
  sectionSlugParams,
} from "@/components/SectionPages";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () => sectionSlugParams("men");

export async function generateMetadata({ params }: Props) {
  return sectionSlugMetadata("men", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <SectionSlug section="men" slug={(await params).slug} />;
}
