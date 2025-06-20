const Job = require("../models/Job");

// @desc Create a new job (Admin only)
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, type } = req.body;
    if (!title || !company || !location || !description)
      return res.status(400).json({ msg: "All fields required" });

    const job = await Job.create({
      title, company, location, description, type,
      postedBy: req.user.id
    });

    res.status(201).json({ success: true, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating job" });
  }
};

// @desc Get all jobs (with optional filters)
exports.getJobs = async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (type) query.type = type;

    const jobs = await Job.find(query).populate("postedBy", "name email");
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching jobs" });
  }
};

// @desc Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name email")
      .populate({
        path: "applicants",
        populate: { path: "user", select: "name email _id" }
      });

    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.status(200).json({ success: true, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching job" });
  }
};

// @desc Update a job (Admin only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.status(200).json({ success: true, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating job" });
  }
};

// @desc Delete job (Admin only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.status(200).json({ success: true, msg: "Job deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting job" });
  }
};
