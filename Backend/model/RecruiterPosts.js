const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  name: String,
  email: String,
  resumeLink: String,
  image: String,
  predictedCategory: {
    type: String,
    default: "Not specified",
  },
  status: {
    type: String,
    default: "unapproved",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  title: String,
  sector: String,
  level: String,
  type: String,
  location: String,
  city: String,
  openings: String,
  minSalary: String,
  maxSalary: String,
  deadline: String,
  requirements: String,
  skills: String,
  PostType: String,
  postedAt: {
    type: Date,
    default: Date.now,
  },
  applicants: {
    type: [applicantSchema],
    default: [],
  },
});

const recruiterPostSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  posts: {
    type: [postSchema],
    default: [],
  },
});

const RecruiterPost = mongoose.model("RecruiterPost", recruiterPostSchema);
module.exports = RecruiterPost;
