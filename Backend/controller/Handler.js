const bcrypt = require("bcrypt");
const User = require("../model/loginSchema");
const RecruiterPost = require("../model/RecruiterPosts");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { exec } = require("child_process");
const os = require("os");
const path = require("path")
const axios = require("axios");
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Incorrect Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect Password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const handleSignup = async (req, res) => {
  const { email, password, confirmPassword, role, details } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({
      email,
      password: hashedPassword,
      role,
      details: details || null,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const CheckDetails = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.details && Object.keys(user.details).length > 0) {
      return res.json({ result: "yes", Details: user.details });
    } else {
      return res.json({ result: "no" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const AddDetails = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      designation,
      province,
      city,
      postalCode,
      currentAddress,
      predictedCategory,
    } = req.body;

    const sectors = Array.isArray(req.body.sectors)
      ? req.body.sectors
      : Object.values(req.body).filter((_, key) => key.startsWith("sectors["));

    const profile = req.files?.profile?.[0]?.filename || null;
    const resume = req.files?.resume?.[0]?.filename || null;

    const details = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      designation,
      province,
      city,
      postalCode,
      currentAddress,
      sectors,
      profile, // filename saved in /upload/img/
      resume, // filename saved in /upload/resume/
      predictedCategory, // category predicted by classification model
    };

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { details },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Details added successfully", details: user.details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const RecruiterAddDetails = async (req, res) => {
  try {
    const {
      CompanyName,
      RecuriterName,
      CompanyPhone,
      companyWebsite,
      designation,
      CompanyDescription,
      province,
      city,
      postalCode,
      currentAddress,
    } = req.body;

    const sectors = Array.isArray(req.body.sectors)
      ? req.body.sectors
      : Object.values(req.body).filter((_, key) => key.startsWith("sectors["));

    const logo = req.files?.logo?.[0]?.filename || null;
    const certificate = req.files?.certificate?.[0]?.filename || null;

    const details = {
      CompanyName,
      RecuriterName,
      CompanyPhone,
      companyWebsite,
      designation,
      CompanyDescription,
      province,
      city,
      postalCode,
      currentAddress,
      sectors,
      logo, // filename saved in /upload/logos/
      certificate, // filename saved in /upload/certificates/
    };

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { details },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Details added successfully", details: user.details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const PostByRecruiter = async (req, res) => {
  try {
    const email = req.user.email;
    const postData = req.body;

    let recruiter = await RecruiterPost.findOne({ email });

    if (recruiter) {
      // Recruiter exists, add post to existing posts
      recruiter.posts.push(postData);
      await recruiter.save();
      return res.status(200).json({
        message: "Post added successfully",
        post: recruiter.posts[recruiter.posts.length - 1],
      });
    } else {
      // First post by this recruiter
      const newRecruiter = new RecruiterPost({
        email,
        posts: [postData],
      });

      await newRecruiter.save();
      return res
        .status(201)
        .json({ message: "First post created", post: newRecruiter.posts[0] });
    }
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const GetAllPosts = async (req, res) => {
  try {
    const { postType } = req.params; // "intern" or "job"
    const typeFilter = postType.toLowerCase();

    const recruiters = await RecruiterPost.find({});
    const allPosts = [];

    for (const recruiter of recruiters) {
      const user = await User.findOne({ email: recruiter.email });

      const companyName = user?.details?.CompanyName || "Unknown Company";
      const logo = user?.details?.logo || "No logo";

      recruiter.posts.forEach((post) => {
        const isIntern = post.PostType?.toLowerCase() === "intern";

        //  Filter logic
        if (
          (typeFilter === "intern" && isIntern) ||
          (typeFilter === "job" && !isIntern)
        ) {
          const postObj = post.toObject();

          allPosts.push({
            ...postObj,
            recruiterEmail: recruiter.email,
            companyName,
            logo,
          });
        }
      });
    }

    res.status(200).json({ posts: allPosts });
  } catch (err) {
    console.error("Fetch all posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const GetAllPostsFront = async (req, res) => {
  try {
    const recruiters = await RecruiterPost.find({}, { "posts.applicants": 0 });

    const allPosts = [];

    for (const recruiter of recruiters) {
      const user = await User.findOne({ email: recruiter.email });

      const companyName = user?.details?.CompanyName || "Unknown Company";
      const logo = user?.details?.logo || "No logo";

      recruiter.posts.forEach((post) => {
        const postObj = post.toObject();

        allPosts.push({
          ...postObj,
          recruiterEmail: recruiter.email,
          companyName,
          logo,
        });
      });
    }

    res.status(200).json({ posts: allPosts });
  } catch (err) {
    console.error("Fetch all posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const GetAllPostsByEmail = async (req, res) => {
  try {
    const email = req.user.email;
    const { postType } = req.params; // "intern" or "job"
    const typeFilter = postType.toLowerCase();

    const recruiter = await RecruiterPost.findOne({ email });
    if (!recruiter)
      return res.status(404).json({ error: "Recruiter not found" });

    const user = await User.findOne({ email: recruiter.email });

    const companyName = user?.details?.CompanyName || "Unknown Company";
    const logo = user?.details?.logo || "No logo";

    const allPosts = [];

    recruiter.posts.forEach((post) => {
      const isIntern = post.PostType?.toLowerCase() === "intern";

      // Filter logic
      if (
        (typeFilter === "intern" && isIntern) ||
        (typeFilter === "job" && !isIntern)
      ) {
        const postObj = post.toObject();

        allPosts.push({
          ...postObj,
          recruiterEmail: recruiter.email,
          companyName,
          logo,
        });
      }
    });

    res.status(200).json({ posts: allPosts });
  } catch (err) {
    console.error("Fetch all posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const FetchAllPostsByEmail = async (req, res) => {
  try {
    const email = req.user.email;

    const recruiter = await RecruiterPost.findOne({ email });
    if (!recruiter)
      return res.status(404).json({ error: "Recruiter not found" });

    const user = await User.findOne({ email: recruiter.email });

    const companyName = user?.details?.CompanyName || "Unknown Company";
    const logo = user?.details?.logo || "No logo";

    let totalApplicants = 0;
    let shortlistedApplicants = 0;

    const allPosts = recruiter.posts.map((post) => {
      const postObj = post.toObject();
      const applicants = post.applicants || [];

      totalApplicants += applicants.length;
      shortlistedApplicants += applicants.filter(
        (a) => a.status?.toLowerCase() === "approved"
      ).length;

      return {
        ...postObj,
        recruiterEmail: recruiter.email,
        companyName,
        logo,
      };
    });

    res.status(200).json({
      posts: allPosts,
      totalPosts: recruiter.posts.length,
      totalApplicants,
      shortlistedApplicants,
    });
  } catch (err) {
    console.error("Fetch all posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const ApplyPost = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const postId = req.params.postId;
    const sector = req.params.sector?.toLowerCase();

    // Step 1: Find the user
    const user = await User.findOne({ email: userEmail });

    if (!user || !user.details) {
      return res.status(404).json({ message: "User details not found" });
    }

    const predictedCategory = user.details.predictedCategory?.toLowerCase();

    // Step 1.5: Check if sector matches predictedCategory
    if (sector !== predictedCategory) {
      return res.status(200).json({
        applied: false,
        message: `Your profile category (${predictedCategory}) doesn't match your selected sector (${sector}).`,
      });
    }

    // Step 2: Find the recruiter who owns the post
    const recruiter = await RecruiterPost.findOne({
      "posts._id": postId,
    });

    if (!recruiter) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Step 3: Find the specific post
    const post = recruiter.posts.id(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found in recruiter's posts" });
    }

    // Step 4: Check if already applied
    const alreadyApplied = post.applicants.some((a) => a.email === user.email);
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied to this post." });
    }

    // Step 5: Create applicant object
    const applicant = {
      name: `${user.details.firstName} ${user.details.lastName}`,
      email: user.email,
      resumeLink: `/upload/resume/${user.details.resume}`,
      image: `/upload/img/${user.details.profile}`,
      predictedCategory: predictedCategory ?? "Not specified",
    };

    // Step 6: Add to applicants array
    post.applicants.push(applicant);

    // Step 7: Save
    await recruiter.save();

    res.status(200).json({ message: "Applied successfully" });
  } catch (error) {
    console.error("Error applying to post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// const updateDetails = async (req, res) => {

//   try {
//     const email = req.user.email;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const oldProfile = user.details?.profile;
//     const oldResume = user.details?.resume;

//     const {
//       firstName,
//       lastName,
//       gender,
//       dateOfBirth,
//       designation,
//       province,
//       city,
//       postalCode,
//       currentAddress,
//       predictedCategory,
//     } = req.body;

//     const sectors = Array.isArray(req.body.sectors)
//       ? req.body.sectors
//       : Object.values(req.body).filter((_, key) => key.startsWith("sectors["));

//     const profile = req.files?.profile?.[0]?.filename || oldProfile;
//     const resume = req.files?.resume?.[0]?.filename || oldResume;

//     // Remove old files if new ones uploaded
//     const profilePath = path.join(__dirname, "../upload/img/", oldProfile);
//     if (
//       req.files?.profile?.[0]?.filename &&
//       oldProfile &&
//       fs.existsSync(profilePath)
//     ) {
//       fs.unlinkSync(profilePath);
//     }

//     const resumePath = path.join(__dirname, "../upload/resume/", oldResume);
//     if (
//       req.files?.resume?.[0]?.filename &&
//       oldResume &&
//       fs.existsSync(resumePath)
//     ) {
//       fs.unlinkSync(resumePath);
//     }

//     const details = {
//       firstName,
//       lastName,
//       gender,
//       dateOfBirth,
//       designation,
//       province,
//       city,
//       postalCode,
//       currentAddress,
//       sectors,
//       profile,
//       resume,
//       predictedCategory,
//     };

//     const updatedUser = await User.findOneAndUpdate(
//       { email },
//       { details },
//       { new: true }
//     );

//     res.json({
//       message: "Details updated successfully",
//       details: updatedUser.details,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
const updateDetails = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const oldProfile = user.details?.profile;
    const oldResume = user.details?.resume;

    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      designation,
      province,
      city,
      postalCode,
      currentAddress,
      predictedCategory,
    } = req.body;

    const sectors = Array.isArray(req.body.sectors)
      ? req.body.sectors
      : Object.values(req.body).filter((_, key) => key.startsWith("sectors["));

    const profile = req.files?.profile?.[0]?.filename || oldProfile;
    const resume = req.files?.resume?.[0]?.filename || oldResume;

    // Remove old profile if new one uploaded
    if (req.files?.profile?.[0]?.filename && oldProfile) {
      const profilePath = path.join(__dirname, "../upload/img/", oldProfile);
      if (fs.existsSync(profilePath)) {
        fs.unlinkSync(profilePath);
      }
    }

    // Remove old resume if new one uploaded
    if (req.files?.resume?.[0]?.filename && oldResume) {
      const resumePath = path.join(__dirname, "../upload/resume/", oldResume);
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    }

    const details = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      designation,
      province,
      city,
      postalCode,
      currentAddress,
      sectors,
      profile,
      resume,
      predictedCategory,
    };

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { details },
      { new: true }
    );

    res.json({
      message: "Details updated successfully",
      details: updatedUser.details,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateRecruiterDetails = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const oldLogo = user.details?.logo;
    const oldCertificate = user.details?.certificate;

    const {
      CompanyName,
      RecuriterName,
      CompanyPhone,
      companyWebsite,
      designation,
      CompanyDescription,
      province,
      city,
      postalCode,
      currentAddress,
    } = req.body;

    const sectors = Array.isArray(req.body.sectors)
      ? req.body.sectors
      : Object.values(req.body).filter((_, key) => key.startsWith("sectors["));

    const logo = req.files?.logo?.[0]?.filename || oldLogo;
    const certificate = req.files?.certificate?.[0]?.filename || oldCertificate;

    // Remove old files if new ones uploaded
    if (req.files?.logo?.[0]?.filename && oldLogo) {
      fs.unlinkSync(path.join(__dirname, "../upload/logos/", oldLogo));
    }
    if (req.files?.certificate?.[0]?.filename && oldCertificate) {
      fs.unlinkSync(
        path.join(__dirname, "../upload/certificates/", oldCertificate)
      );
    }

    const details = {
      CompanyName,
      RecuriterName,
      CompanyPhone,
      companyWebsite,
      designation,
      CompanyDescription,
      province,
      city,
      postalCode,
      currentAddress,
      sectors,
      logo,
      certificate,
    };

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { details },
      { new: true }
    );

    res.json({
      message: "Recruiter details updated successfully",
      details: updatedUser.details,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUserDetailsByEmail = async (req, res) => {
  try {
    const email = req.user.email; // extracted by ensureAuthentication

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ details: user.details });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const resumeRank = async (req, res) => {
  const { requirement, resumes } = req.body;
  const recruiterEmail = req.user.email;


  if (!requirement || !Array.isArray(resumes) || resumes.length === 0) {
    return res.status(400).json({ error: "Missing requirement or resumes" });
  }

  const recruiterPosts = await RecruiterPost.find({ email: recruiterEmail });

  if (!recruiterPosts || recruiterPosts.length === 0) {
    return res.status(400).json({ error: "No posts found for recruiter" });
  }

  // Support both ["file.pdf"] and [{ resumeLink: "/upload/resume/file.pdf" }]
  const resumeFileNames = resumes.map((r) =>
    typeof r === "string" ? path.basename(r) : path.basename(r.resumeLink || "")
  );

  const unapprovedResumes = [];
  recruiterPosts.forEach((rp) => {
    rp.posts.forEach((post) => {
      post.applicants.forEach((app) => {
        const resumeName = path.basename(app.resumeLink || "");
        if (app.status === "unapproved" && resumeFileNames.includes(resumeName)) {
          unapprovedResumes.push({
            name: resumeName,
            path: path.join(process.cwd(), app.resumeLink),
          });
        }
      });
    });
  });

  if (!unapprovedResumes.length) {
    return res.status(400).json({ error: "No unapproved resumes found" });
  }

  try {
    const validResumes = unapprovedResumes.filter((r) => fs.existsSync(r.path));

    if (!validResumes.length) {
      return res.status(400).json({ error: "No valid unapproved resumes found" });
    }

    const response = await axios.post(
      "http://127.0.0.1:8000/match",
      { requirement, resumes: validResumes },
      { timeout: 60000 }
    );

    return res.status(200).json(response.data);
  } catch (err) {
    console.error("[Server error]", err.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const applicants = async (req, res) => {
  try {
    const candidateEmail = req.user.email;

    const allRecruiters = await RecruiterPost.find();

    let matchedApplicants = [];

    for (const recruiter of allRecruiters) {
      // Fetch recruiter user info to get companyName and logo
      const recruiterUser = await User.findOne({ email: recruiter.email });

      const companyName =
        recruiterUser?.details?.CompanyName || "Not specified";
      const logo = recruiterUser?.details?.logo || "no-logo.png";

      recruiter.posts.forEach((post) => {
        post.applicants.forEach((applicant) => {
          if (applicant.email === candidateEmail) {
            matchedApplicants.push({
              ...applicant.toObject(),
              postTitle: post.title,
              openings: post.openings,
              location: post.city,
              type: post.PostType,
              recruiterEmail: recruiter.email,
              companyName,
              logo,
            });
          }
        });
      });
    }

    res.status(200).json({ applicants: matchedApplicants });
  } catch (error) {
    console.error("Error fetching applicant data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateApplicantStatus = async (req, res) => {
  const applicantId = req.params._id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const recruiter = await RecruiterPost.findOne({
      "posts.applicants._id": applicantId,
    });

    if (!recruiter) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    let updated = false;

    recruiter.posts.forEach((post) => {
      post.applicants.forEach((applicant) => {
        if (applicant._id.toString() === applicantId) {
          applicant.status = status;
          updated = true;
        }
      });
    });

    if (!updated) {
      return res.status(404).json({ message: "Applicant not found in posts" });
    }

    await recruiter.save();
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const classification = (req, res) => {
  const filePath = req.file.path;

  exec(`python classify.py "${filePath}"`, (error, stdout, stderr) => {
    // Delete the file regardless of success or failure to avoid leftovers
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Failed to delete file:", unlinkErr);
      }
    });

    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: "Prediction failed" });
    }

    return res.json({ category: stdout.trim() });
  });
};

const doDelete=async (req, res) => {
  try {
    const recruiterEmail = req.user.email;
    const { postId } = req.params;
    const recruiter = await RecruiterPost.findOne({ email: recruiterEmail });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    const beforeCount = recruiter.posts.length;
    recruiter.posts = recruiter.posts.filter((p) => p._id.toString() !== postId);

    if (recruiter.posts.length === beforeCount)
      return res.status(404).json({ message: "Post not found" });

    await recruiter.save();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error deleting post" });
  }

}
module.exports = {
  handleLogin,
  handleSignup,
  CheckDetails,
  AddDetails,
  RecruiterAddDetails,
  PostByRecruiter,
  GetAllPosts,
  ApplyPost,
  updateDetails,
  updateRecruiterDetails,
  getUserDetailsByEmail,
  GetAllPostsByEmail,
  GetAllPostsFront,
  FetchAllPostsByEmail,
  resumeRank,
  applicants,
  updateApplicantStatus,
  classification,
  doDelete
};
