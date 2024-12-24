import fs from 'fs';
import puppeteer from 'puppeteer';

async function start() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 375, height: 667 });

  let data = [];

  for (let i = 2; i <= 10; i++) {
    const url = `https://sohaticare.com/collections/skincare-concern?page=${i}`;
    console.log(`Scraping page: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    try {
      await page.waitForSelector('.zevi-product-card', { timeout: 5000 });

      const newItems = await page.evaluate(() => {
        let items = [];
        const productElements = document.querySelectorAll('.zevi-product-card');

        productElements.forEach((product) => {
          const image = product.querySelector('.zevi-image-container img') ? product.querySelector('.zevi-image-container img').src : '';
          const name = product.querySelector('.zevi-title-new') ? product.querySelector('.zevi-title-new').textContent.trim() : '';
          const price = product.querySelector('.zevi-price-label-new') ? product.querySelector('.zevi-price-label-new').textContent.trim() : '';
          const link = product.querySelector('a') ? product.querySelector('a').href : '';  // Extracting link

          console.log(price);
          console.log(link);
          items.push({ image, name, price, link });  // Include link in the data
        });

        return items;
      });

      data = data.concat(newItems);
    } catch (error) {
      console.log(`Error scraping page ${i}:`, error);
    }
  }

  // Write the scraped data to a JSON file
  fs.writeFile("extractedData.json", JSON.stringify(data, null, 2), (error) => {
    if (error) {
      console.error("Error writing to file:", error);
    } else {
      console.log("Data has been written to extractedData.json");
    }
  });

  await browser.close();
}

start();
