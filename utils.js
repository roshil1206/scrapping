const fs = require("fs");
const { By } = require("selenium-webdriver");
process.loadEnvFile();

const print = async (Element, fileName) => {
  const innerHTML = await Element.getAttribute("innerHTML");
  fs.writeFileSync(fileName, innerHTML);
};

const getJSON = async (Element) => {
  const jobTitleElement = await Element.findElement(By.css(".job-title span"));
  const jobTitle = await jobTitleElement.getText();

  const linkElement = await Element.findElement(
    By.css('a[data-ph-at-id="job-link"]')
  );

  // Get the value of the href attribute
  const href = await linkElement.getAttribute("href");

  let jobLocations = [];
  let jobLocationElements = await Element.findElements(By.css(".location"));

  if (jobLocationElements.length === 0) {
    const locationElement = await Element.findElement(By.css(".job-location"));
    const locationText = await locationElement.getText();
    jobLocations.push(locationText);
  } else {
    const jobLocationPromise = jobLocationElements.map(async (ele) => {
      const data = await ele.getAttribute("innerHTML");
      return data.toString().trim();
    });
    jobLocations = await Promise.all(jobLocationPromise);
  }
  const jobCategoryElement = await Element.findElement(
    By.css(".job-info .category")
  );
  const jobCategory = await jobCategoryElement.getText();

  const jobTypeElement = await Element.findElement(By.css(".job-info .type"));
  const jobType = await jobTypeElement.getText();

  const jobPostDateElement = await Element.findElement(
    By.css(".job-info .job-postdate")
  );
  const jobPostDate = await jobPostDateElement.getText();

  return {
    jobTitle,
    jobLocations,
    jobCategory,
    jobType,
    jobPostDate,
    href,
  };
};

const getUniqueJobs = (existingJobs, newJobs) => {
  const uniqueJobs = [];
  newJobs.forEach((jobA) => {
    const isUnique = existingJobs.every(
      (jobB) =>
        jobA.jobTitle !== jobB.jobTitle ||
        jobA.jobCategory !== jobB.jobCategory ||
        jobA.jobPostDate !== jobB.jobPostDate
    );

    if (isUnique) {
      uniqueJobs.push(jobA);
    }
  });
  return uniqueJobs;
};

const getEmailOptions = (jobData) => {
  return {
    from: process.env.Mailer_User,
    to: process.env.Mail_Receiver,
    subject: `RBC - ${jobData.jobTitle}`,
    text: `
Job Title: ${jobData.jobTitle}
Job Locations: ${jobData.jobLocations.join(", ")}
Job Category: ${jobData.jobCategory}
Job Type: ${jobData.jobType}
Job Post Date: ${jobData.jobPostDate}
Job Link: ${jobData.href}
`,
  };
};

module.exports = { print, getJSON, getUniqueJobs, getEmailOptions };
