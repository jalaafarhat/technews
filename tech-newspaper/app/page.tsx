import React from "react";
import Image from "next/image";

type Article = {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  imageUrl: string;
};

const getArticles = async (): Promise<Article[]> => {
  try {
    const res = await fetch("http://localhost:3000/api/articles");
    if (!res.ok) throw new Error(`Failed to fetch, status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};

export default async function HomePage() {
  const articles = await getArticles();
  const issueNumber = articles.length;
  const volumeNumber = new Date().getFullYear() - 2025 + 1;
  // Get current date for the newspaper header
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // If we have articles, get the first one as the featured article
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  // The rest of the articles
  const remainingArticles = articles.length > 0 ? articles.slice(1) : [];

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Newspaper Masthead */}
        <div className="border-b-4 border-black pb-4 mb-6">
          <div className="text-center">
            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter">
              TECH INSIGHTS HUB
            </h1>
            <div className="flex justify-between items-center mt-2 text-sm border-t border-b border-black py-2">
              <p>
                Vol. {volumeNumber} Issue {issueNumber}
              </p>

              <p className="font-medium">{today}</p>
              <p>techinsightshub.com</p>
            </div>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 border border-gray-300 bg-white">
            <h3 className="mt-2 text-xl font-serif font-medium text-gray-900">
              PRESS DELAY
            </h3>
            <p className="mt-1 text-gray-700 font-serif">
              No articles available at press time. Please check back for the
              evening edition.
            </p>
          </div>
        ) : (
          <div className="newspaper-layout">
            {/* Featured Article - Banner Headline */}
            {featuredArticle && (
              <div className="mb-8 border-b-2 border-black pb-8">
                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {featuredArticle.title.toUpperCase()}
                </h2>
                <div className="md:flex gap-6">
                  <div className="md:w-1/2 mb-4 md:mb-0">
                    <div className="relative h-64 md:h-96 w-full border border-gray-300 bg-white p-1">
                      <Image
                        src={
                          featuredArticle.imageUrl || "/placeholder-article.jpg"
                        }
                        alt={featuredArticle.title}
                        layout="fill" // You can set `layout="intrinsic"` or `layout="responsive"` based on your needs
                        className="w-full h-full object-contain"
                        priority
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-xs border-t border-gray-300">
                        Photo: TECH INSIGHTS HUB
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <div className="font-serif text-lg leading-relaxed space-y-2">
                      <p className="first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">
                        {featuredArticle.content
                          .split(" ")
                          .slice(0, 30)
                          .join(" ")}
                        ...
                      </p>
                    </div>
                    <div className="mt-4 text-sm">
                      <span className="font-medium">
                        By {featuredArticle.author}
                      </span>{" "}
                      |
                      <span className="italic ml-1">
                        {new Date(featuredArticle.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <a
                      href={`/articles/${featuredArticle._id}`}
                      className="inline-block mt-4 text-sm font-medium border-b-2 border-black hover:text-gray-700"
                    >
                      CONTINUE READING
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Columns of Articles */}
            <div className="grid md:grid-cols-3 gap-6">
              {remainingArticles.map((article, index) => (
                <article
                  key={article._id}
                  className={`mb-6 ${
                    index % 3 === 0 ? "border-r border-gray-300 pr-6" : ""
                  } ${index % 3 === 1 ? "border-r border-gray-300 pr-6" : ""}`}
                >
                  <h3 className="font-serif text-xl font-bold mb-2 leading-tight">
                    {article.title}
                  </h3>

                  <div className="relative h-40 w-full mb-3 border border-gray-300 bg-white p-1">
                    <img
                      src={article.imageUrl || "/placeholder-article.jpg"}
                      alt={article.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <p className="font-serif text-sm leading-snug line-clamp-4 mb-2">
                    {article.content}
                  </p>

                  <div className="text-xs mt-2">
                    <span className="font-medium">By {article.author}</span>
                  </div>

                  <a
                    href={`/articles/${article._id}`}
                    className="inline-block mt-1 text-xs font-medium hover:text-gray-700"
                  >
                    Read more...
                  </a>

                  {/* Decorative line between articles */}
                  {index !== remainingArticles.length - 1 && (
                    <div className="border-b border-dotted border-gray-400 my-6"></div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Newspaper Footer */}
        <div className="mt-12 pt-4 border-t-2 border-black text-center">
          <p className="text-sm font-serif">
            TECH INSIGHTS HUB © {new Date().getFullYear()} | All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
