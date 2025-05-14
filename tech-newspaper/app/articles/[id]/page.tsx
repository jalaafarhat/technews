import { notFound } from "next/navigation";
import Image from "next/image";

type Article = {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  imageUrl: string;
};

const fetchArticle = async (id: string): Promise<Article | null> => {
  try {
    const response = await fetch(`http://localhost:3000/api/articles/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) return null;
    const article = await response.json();
    return article;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export default async function ArticlePage(props: { params: { id: string } }) {
  const { id } = props.params;
  const article: Article | null = await fetchArticle(id);

  if (!article) {
    notFound();
  }

  // Format the date in newspaper style
  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Calculate estimated reading time
  const readingTime = Math.ceil(article.content.split(" ").length / 200);

  // Split content into paragraphs for better styling
  const paragraphs = article.content
    .split("\n")
    .filter((p: string) => p.trim() !== "");

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Newspaper Masthead - Smaller version */}
        <div className="border-b-2 border-black pb-2 mb-6">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tighter">
              TECH INSIGHTS HUB
            </h1>
            <div className="flex justify-between items-center mt-2 text-xs border-t border-b border-black py-1">
              <p>{formattedDate}</p>
              <p>techinsightshub.com</p>
            </div>
          </div>
        </div>

        <article className="bg-white border border-gray-200 p-6 md:p-10 shadow-sm">
          {/* Article Header */}
          <header className="mb-8 border-b border-gray-300 pb-6">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {article.title.toUpperCase()}
            </h2>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">By {article.author}</span>
              <span>|</span>
              <span className="italic">{formattedDate}</span>
              <span>|</span>
              <span>{readingTime} min read</span>
            </div>
          </header>

          {/* Featured Image - Using Next.js Image with explicit width/height */}
          <div className="mb-8 border border-gray-300 bg-white p-1">
            <div className="relative aspect-[16/9]">
              <Image
                src={article.imageUrl || "/placeholder.svg"} // Fallback if imageUrl is not provided
                alt={article.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                unoptimized={true} // For dynamic URLs
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-xs border-t border-gray-300">
                Photo: TECH INSIGHTS HUB
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="article-content font-serif text-lg leading-relaxed">
            {paragraphs.map((paragraph: string, index: number) => (
              <p
                key={index}
                className={`mb-6 ${
                  index === 0
                    ? "first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:leading-none"
                    : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} TECH INSIGHTS HUB. All rights
              reserved.
            </p>
            <p className="mt-2">
              This article first appeared in the print edition of TECH INSIGHTS
              HUB on {formattedDate}.
            </p>
          </footer>
        </article>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block font-serif text-sm font-medium border-b-2 border-black hover:text-gray-700"
          >
            BACK TO HOME PAGE
          </a>
        </div>
      </div>
    </div>
  );
}
