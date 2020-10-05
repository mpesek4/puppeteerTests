const puppeteer = require('puppeteer');

const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};


const clickByText = async function(page, text, element) {
    element = element || 'a';
    await page.evaluate(() => {
        [...document.querySelectorAll('a')].find(element => element.textContent.includes("Feedback")).click();
      })
    }


console.log("test")

startScript = async () => {
    try{
        console.log("test")
        const browser = await puppeteer.launch()
        console.log("1")
        const page = await browser.newPage()
        console.log("1")

        await page.goto('http://www.radiosure.com/stations/')
        console.log("1")

        await clickByText(page, "published stations")
        await page.waitForNavigation({waitUntil: 'load'})

        

        await browser.close()
    } catch (error){
        console.log(error)
    }
}

startScript()