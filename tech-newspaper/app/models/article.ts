import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

const Article =
  mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export default Article;
