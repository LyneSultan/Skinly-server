import fs from 'fs';
import puppeteer from 'puppeteer';


async function start() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 375, height: 667 });

  await page.goto("https://sohaticare.com/collections/skincare-concern");

  await page.waitForSelector('.zevi-product-card', { timeout: 5000 });

  let data = [];

  while (true) {
    const newItems = await page.evaluate(() => {
      let items = [];
      const productElements = document.querySelectorAll('.zevi-product-card');

      productElements.forEach((product) => {
        const image = product.querySelector('.zevi-image-container img') ? product.querySelector('.zevi-image-container img').src : '';
        const name = product.querySelector('.zevi-title-new') ? product.querySelector('.zevi-title-new').textContent.trim() : '';
        const price = product.querySelector('.zevi-price-label-new') ? product.querySelector('.zevi-price-label-new').textContent.trim() : '';

        items.push({ image, name, price });
      });

      return items;
    });

    data = data.concat(newItems);

    try {
      await page.waitForSelector('.pagination-arrow.next-arrow a', { visible: true, timeout: 30000 });

      const showMoreButton = await page.$('.pagination-arrow.next-arrow a');
      if (showMoreButton) {
        console.log("Show More button found, pressing...");
        await showMoreButton.click();
      } else {
        console.log("No Show More button found, scraping complete.");
        break;
      }
    } catch (error) {
      console.log("Timeout or error while waiting for Show More button:", error);
      break;
    }
  }


  fs.writeFile("extractedData.json", JSON.stringify(data, null, 2), (error) => {
    if (error) {
      console.error(error);
    }
    console.log("Data has been written to extractedData.json");
  });

  await browser.close();
}

start();
