const { getDriver, openWebsite, getJobs } = require("./operations");
const mongoose = require("mongoose");
const connection = require("./DB/Connection");
const JobsModel = require("./DB/JobsModel");
const { getUniqueJobs, getEmailOptions } = require("./utils");
const sendEmail = require("./mailer");
process.loadEnvFile();

const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  const driver = await getDriver();
  try {
    await openWebsite(driver, process.env.WEBSITE);
    const jobs = await getJobs(driver);
    await connection();

    const existingJobs = await JobsModel.find();

    const newJobs = getUniqueJobs(existingJobs, jobs);
    console.log(newJobs);
    if (newJobs.length > 0) {
      await JobsModel.insertMany(newJobs);
    }

    newJobs.forEach(async (jobData) => {
      await sendEmail(getEmailOptions(jobData));
    });
    res.json(newJobs);
  } catch (error) {
    console.log(error);
  } finally {
    driver.close();
    mongoose.connection.close();
  }
});
app.listen(80, () => {
  console.log(`Example app listening at http://localhost:80}`);
});
