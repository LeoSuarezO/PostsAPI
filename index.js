const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/postsapi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });

app.use(express.json());
app.use(cors());

const postSchema = new mongoose.Schema({
  postId: {
    type: String,
    unique: true,
    required: true,
  },
  authorId: {
    type: String,
    unique: true,
    required: true,
  },
  title: String,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date,
});

const Post = mongoose.model("Post", postSchema);

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/api/create", async (req, res) => {
  try {
    const { postId, authorId, title, isPublished } = req.body;
    const createdAt = new Date();
    const post = new Post({
      postId,
      authorId,
      title,
      isPublished,
      createdAt,
    });

    if (post.isPublished) {
      post.publishedAt = new Date();
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/api/update:/postID", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { authorId, title, isPublished, updatedAt } = req.body;
    const post = await Post.findOne(postId);

    post.authorId = authorId;
    post.title = title;
    post.isPublished = isPublished;
    post.updatedAt = updatedAt;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/api/postById/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/api/sortedList", async (req, res) => {
  try {
    const posts = await Post.find().sort({ title: 1 });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
