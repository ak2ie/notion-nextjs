import { fetchPageBlocks, fetchPageBySlug, notion } from "@/lib/notion";
import { notFound } from "next/navigation";
import { NotionRenderer } from "@notion-render/client";
type Props = {
  params: { slug: string };
};

async function getPageBySlug(slug: string) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_SECRET!}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        filter: {
          and: [
            {
              property: "Slug",
              rich_text: {
                equals: slug,
              },
            },
          ],
        },
      }),
      next: {
        revalidate: 10,
      },
    }
  );
  return response.json();
}

async function getPageBlocks(pageId: string) {
  const response = await fetch(
    `https://api.notion.com/v1/blocks/${pageId}/children`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_SECRET!}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      next: {
        revalidate: 30, // キャッシュする時間[秒]
      },
    }
  );
  return response.json();
}

const Articles = async ({ params: { slug } }: Props) => {
  // await new Promise((resolve) => setTimeout(resolve, 2000))
  //   const article = await fetchPageBySlug(slug);
  const article = await getPageBySlug(slug);

  if (!article["results"].length) {
    notFound();
  }

  // const blocks = await fetchPageBlocks(article["results"][0].id);
  const blocks = await getPageBlocks(article["results"][0].id);
  const renderer = new NotionRenderer({
    client: notion,
  });

  const html = await renderer.render(...blocks.results);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
};

export default Articles;
