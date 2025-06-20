const Application = require("../models/Application");
const Job = require("../models/Job");

// @desc Apply to a job
exports.applyToJob = async (req, res) => {
  
  try {
    const jobId = req.params.id
    const { message, resumeUrl } = req.body;
    if (!jobId || !resumeUrl)
      return res.status(400).json({ msg: "Job ID and resume required" });

    // Prevent duplicate application for same user/job
    const exists = await Application.findOne({
      job: jobId,
      user: req.user.id
    });
    if (exists)
      return res.status(409).json({ msg: "You already applied to this job" });

    const app = await Application.create({
      job: jobId,
      user: req.user.id,
      message: message || "",
      resumeUrl
    });

    await Job.findByIdAndUpdate(jobId, { $push: { applicants: app._id } });

    res.status(201).json({ success: true, application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error applying to job" });
  }
};
