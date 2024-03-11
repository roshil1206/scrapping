const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobsSchema = new Schema({
  jobTitle: String,
  jobLocations: [String],
  jobCategory: String,
  jobType: String,
  jobPostDate: String,
});

const JobsModel = new mongoose.model("jobs", JobsSchema);

module.exports = JobsModel;
