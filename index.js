const { getDriver, openWebsite, getJobs } = require("./operations");
const mongoose = require("mongoose");
const connection = require("./DB/Connection");
const JobsModel = require("./DB/JobsModel");
const { getUniqueJobs } = require("./utils");
process.loadEnvFile();

const main = async () => {
  const driver = await getDriver();
  try {
    await openWebsite(driver, process.env.WEBSITE);
    const jobs = await getJobs(driver);
    await connection();

    const existingJobs = await JobsModel.find();
    const newJobs = getUniqueJobs(existingJobs, jobs);

    await JobsModel.insertMany(newJobs);
  } catch (error) {
    console.log(error);
  } finally {
    driver.close();
    mongoose.connection.close();
  }
};

main();
