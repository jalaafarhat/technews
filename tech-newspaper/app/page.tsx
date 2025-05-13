import React from "react";

// Define the article type
type Article = {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

// Function to fetch articles from the API
const getArticles = async (): Promise<Article[]> => {
  try {
    const res = await fetch("http://localhost:3000/api/articles");
    if (!res.ok) {
      throw new Error(`Failed to fetch, status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};

export default async function HomePage() {
  // Fetching articles data
  const articles = await getArticles();

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.length === 0 ? (
        <p>No articles available.</p>
      ) : (
        articles.map((article: Article) => (
          <a
            href={`/articles/${article._id}`}
            target="_blank" // Opens in a new tab
            key={article._id}
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="mt-2 text-gray-600">
              {article.content.substring(0, 100)}...
            </p>
            <p className="mt-4 text-sm text-gray-500">By {article.author}</p>
          </a>
        ))
      )}
    </div>
  );
}
