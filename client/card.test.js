const puppeteer = require('puppeteer');

describe('Frontend Card Pairing Test', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // 打開瀏覽器來看到測試過程
      slowMo: 50, // 減慢每個操作以便於觀察
    });
    page = await browser.newPage();
  });

  it('should display paired user after login', async () => {
    // Navigate to your app's login page
    await page.goto('http://localhost:3000/login');

    // TODO: Add login steps if necessary

    // Navigate to card component after login
    await page.goto('http://localhost:3000/card');

    // Wait for paired user details to be displayed
    await page.waitForSelector('h3');

    // Check if paired user name is displayed (replace with your selector)
    const pairedUserName = await page.$eval('h3', el => el.textContent);
    expect(pairedUserName).toBeTruthy();
  });

  afterAll(async () => {
    await browser.close();
  });
});
