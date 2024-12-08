const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
//const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {
    console.log(req.user)
    try {
      // Since we have a session, each req contains the logged-in user info (req.user)
      //grabs just the post of the logged in user
      // console.log(req.user) to see everything
      const posts = await Post.find({ user: req.user.id });

      // sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // id param comes from post route - router.get("/:id", ensureAuth, postsController.getPost);
  getPost: async (req, res) => {
    try {

       //const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();
      // http://localhost:2121/post/674ec9847d0b926f24f76fe3
      // id === 674ec9847d0b926f24f76fe3
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // media is stored on cloudinary - the above request responds with url to media and the media id you will
      //need when deleting the content

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);

      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
