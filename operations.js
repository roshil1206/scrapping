const { Builder, Browser, By, until } = require("selenium-webdriver");
const { getJSON } = require("./utils");
const chrome = require("selenium-webdriver/firefox");

const getDriver = async () => {
  return await new Builder()
    .forBrowser(Browser.FIREFOX)
    .setFirefoxOptions(new chrome.Options().addArguments("--headless"))
    .build();
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
