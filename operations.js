const { Builder, Browser, By, until } = require("selenium-webdriver");
const { print, getJSON } = require("./utils");

const getDriver = async () => {
  return await new Builder().forBrowser(Browser.CHROME).build();
};

const openWebsite = async (driver, website) => {
  await driver.get(website);
};

const getJobs = async (driver) => {
  await driver.sleep(2000);

  const JobsListElement = await driver.wait(
    until.elementsLocated(By.css('li[data-ph-at-id="jobs-list-item"]')),
    5000
  );

  return await Promise.all(
    JobsListElement.map(async (jobs) => await getJSON(jobs))
  );
};

module.exports = { getDriver, openWebsite, getJobs };
