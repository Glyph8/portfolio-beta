import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "data/logs");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;       // "YYYY-MM-DD"
  summary: string;
};

export type Post = PostMeta & {
  content: string;    // frontmatter 제거된 순수 마크다운
};

/** content/log/*.mdx 전체를 최신순으로 반환 */
export function getAllPosts(): PostMeta[] {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
      const { data } = matter(raw);

      return {
        slug,
        title:   data.title   as string,
        date:    data.date    as string,
        summary: data.summary as string,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** slug 에 해당하는 파일의 frontmatter + 본문 반환 */
export function getPostBySlug(slug: string): Post {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, `${slug}.mdx`),
    "utf-8"
  );
  const { data, content } = matter(raw);

  return {
    slug,
    title:   data.title   as string,
    date:    data.date    as string,
    summary: data.summary as string,
    content,
  };
}
