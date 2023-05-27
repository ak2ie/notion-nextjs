import { fetchPageBlocks, fetchPageBySlug, notion } from "@/lib/notion";
import { notFound } from "next/navigation";
import { NotionRenderer } from "@notion-render/client";
type Props = {
	params: { slug: string }
};

const Articles = async ({ params: { slug } }: Props) => {
	// await new Promise((resolve) => setTimeout(resolve, 2000))
	const article = await fetchPageBySlug(slug)

	if (!article) { notFound(); }

	const blocks = await fetchPageBlocks(article.id);
	const renderer = new NotionRenderer({
		client: notion
	})

	const html = await renderer.render(...blocks);

	return <div dangerouslySetInnerHTML={{ __html: html }}></div>
}

export default Articles