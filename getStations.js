const puppeteer = require('puppeteer');

const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};


const clickByText = async function(page, text, element) {
    
    let SELECTOR = "#primary > main > article > div > p:nth-child(3) > span:nth-child(2) > a"
    await page.focus(SELECTOR);
    await page.waitFor(2000);
    await page.click(SELECTOR);
    await page.screenshot({
    path: './screenshots/pagel.png'
})
}


console.log("test")

startScript = async () => {
    try{
        console.log("test")
        const browser = await puppeteer.launch()
     
        const page = await browser.newPage()
     

        await page.goto('http://www.radiosure.com/downloadz/')
      

        await clickByText(page, "published stations")
        await page.waitForNavigation({waitUntil: 'load'})

        

        await browser.close()
    } catch (error){
        console.log(error)
    }
}

startScript()