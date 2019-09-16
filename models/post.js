var mongoose = require("mongoose");
//Schema setup
var postSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Post",postSchema);