import {
  SectionSlug,
  sectionSlugMetadata,
  sectionSlugParams,
} from "@/components/SectionPages";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () => sectionSlugParams("women");

export async function generateMetadata({ params }: Props) {
  return sectionSlugMetadata("women", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <SectionSlug section="women" slug={(await params).slug} />;
}
