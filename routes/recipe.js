const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const recipesController = require("../controllers/recipe");
const { ensureAuth } = require("../middleware/auth");

//Post Routes - simplified for now
//Since linked from server js treat each path as post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:id", ensureAuth, recipesController.getRecipe);

//Enables users to create post /w cloudinary for media upload
router.post("/createRecipe", upload.single("file"), recipesController.createRecipe);

//Enables user to like post. In controller uses Post model to update likes by 1
router.post("/favoriteRecipe/:id", recipesController.favoriteRecipe);

//Enables user to like post. In controller uses Post model to update likes by 1
router.put("/likeRecipe/:id", recipesController.likeRecipe);

//Enables user to delete post. In controller uses Post model to delete Post from MongoDB
router.delete("/deleteRecipe/:id", recipesController.deleteRecipe);

module.exports = router;
