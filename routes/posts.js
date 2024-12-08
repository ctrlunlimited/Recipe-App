const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

//Post Routes - simplified for now
//Since linked from server js treat each path as post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:id", ensureAuth, postsController.getPost);

//Enables users to create post /w cloudinary for media upload
router.post("/createPost", upload.single("file"), postsController.createPost);

//Enables user to like post. In controller uses Post model to update likes by 1
router.put("/likePost/:id", postsController.likePost);

//Enables user to delete post. In controller uses Post model to delete Post from MongoDB
router.delete("/deletePost/:id", postsController.deletePost);

module.exports = router;
