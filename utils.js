const fs = require("fs");
const { By } = require("selenium-webdriver");
const print = async (Element, fileName) => {
  const innerHTML = await Element.getAttribute("innerHTML");
  fs.writeFileSync(fileName, innerHTML);
};

const getJSON = async (Element) => {
  const jobTitleElement = await Element.findElement(By.css(".job-title span"));
  const jobTitle = await jobTitleElement.getText();

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

module.exports = { print, getJSON, getUniqueJobs };
