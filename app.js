const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbUri=`mongodb+srv://${dbUser}:${dbPassword}@cluster0.6rz0y.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(dbUri);

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const homeContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, excepturi. Debitis veritatis,eveniet cupiditate ipsa molestiae possimus voluptate repellendus voluptatem est, eius quidem et labor dolor totam laborum soluta dignissimos porro doloribus ad, unde excepturi tempora illum nostrum maxime.Sint, dicta.Itaque, quae ? Numquam pariatur sunt placeat dolor ? Aut, vitae!";
const aboutContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos repellendus omnis deleniti, libero possimus voluptatum soluta est cupiditate asperiores harum nisi delectus id inventore maiores, sequi porro, nam nihil iste quod! Possimus commodi error aspernatur delectus voluptate odit praesentium quibusdam deleniti! Corporis fugit, sint dolore aliquid quos porro officia sunt.";
const contactContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos repellendus omnis deleniti, libero possimus voluptatum soluta est cupiditate asperiores harum nisi delectus id inventore maiores, sequi porro, nam nihil iste quod! Possimus commodi error aspernatur delectus voluptate odit praesentium quibusdam deleniti! Corporis fugit, sint dolore aliquid quos porro officia sunt.";

// schema
const postSchema = mongoose.Schema({
    title: String,
    body: String
});

// model
const Post = mongoose.model('Post', postSchema);

app.get('/', (req, res) => {
    Post.find().then(posts => {
        res.render("home", { content: homeContent, allPosts: posts });
    })
})

app.get('/about', (req, res) => {
    res.render("about", { content: aboutContent });
})

app.get('/contact', (req, res) => {
    res.render("contact", { content: contactContent });
})

app.get('/posts/:postId', (req, res) => {
    const requestedId = req.params.postId;
    Post.findOne({_id: requestedId}).then(post=>{
        res.render("post", { postTitle: post.title, postBody: post.body });
    });
})

app.get('/compose', (req, res) => {
    res.render("compose");
})

app.post('/compose', (req, res) => {

    const post = new Post({
        title: req.body.postTitle,
        body: req.body.postBody
    });
    post.save().then(() => res.redirect("/"));
})

app.listen(3000, () => {
    console.log("server running on port: 3000");
})