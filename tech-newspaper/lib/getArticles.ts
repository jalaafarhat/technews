// lib/getArticles.ts
export const getArticles = async () => {
  const res = await fetch("http://localhost:3000/api/articles", {
    cache: "no-store", // disables caching
  });

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  return res.json();
};
