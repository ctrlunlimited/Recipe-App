const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite");
//const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {
    console.log(req.user)
    try {
      // Since we have a session, each req contains the logged-in user info (req.user)
      //grabs just the post of the logged in user
      // console.log(req.user) to see everything
      const recipes = await Recipe.find({ user: req.user.id });

      // sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFavorites: async (req, res) => {
    console.log(req.user)
    try {
      // Since we have a session, each req contains the logged-in user info (req.user)
      //grabs just the post of the logged in user
      // console.log(req.user) to see everything
      const recipes = await Favorite.find({ user: req.user.id }).populate('recipe');

      // sending post data from mongodb and user data to ejs template
      res.render("favorites.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  // id param comes from post route - router.get("/:id", ensureAuth, postsController.getPost);
  getRecipe: async (req, res) => {
    try {

       //const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();
      // http://localhost:2121/post/674ec9847d0b926f24f76fe3
      // id === 674ec9847d0b926f24f76fe3
      const recipe = await Recipe.findById(req.params.id);
      res.render("recipe.ejs", { recipe: recipe, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createRecipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // media is stored on cloudinary - the above request responds with url to media and the media id you will
      //need when deleting the content

      await Recipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  favoriteRecipe: async (req, res) => {
    try {
      // media is stored on cloudinary - the above request responds with url to media and the media id you will
      //need when deleting the content

      await Favorite.create({
        user: req.user.id,
        recipe: req.params.id,
      });
      console.log("Post has been added!");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likeRecipe: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      // Find post by id
      
      let recipe = await Recipe.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(recipe.cloudinaryId);

      // Delete post from db
      await Recipe.remove({ _id: req.params.id });
      console.log("Deleted Recipe");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
