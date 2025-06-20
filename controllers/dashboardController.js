const Job = require("../models/Job");
exports.getDashboardData = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .populate({ path: "applicants", populate: { path: "user" } });

    res.status(200).json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ msg: "Error loading dashboard" });
  }
};