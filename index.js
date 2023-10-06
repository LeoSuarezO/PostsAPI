const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/postsapi', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
 console.log('MongoDB connected!');   
})
.catch(err => {
    console.error('MongoDB connection error: ', err);
});

const postSchema = new mongoose.Schema({
    authorId: {
        type: String,
        unique: true, // Hace que authorId sea único
        required: true // Puedes agregar esto si deseas que authorId sea obligatorio
      },
      title: String,
      isPublished: Boolean,
      createdAt: Date,
      updatedAt: Date,
      publishedAt: Date
})

const Post = mongoose.model('Post', postSchema);

app.use(express.json());

app.get("/api/posts", async(req, res) => {
    const posts = await Post.find({});
    res.json(posts);
});

app.post("/api/create", async(req, res) =>{
    const {authorId, title, isPublished, createdAt, updatedAt, publishedAt} = req.body;
    const post = new Post({authorId, title, isPublished, createdAt, updatedAt, publishedAt});
    await post.save();
    res.json(post);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});