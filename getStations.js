const puppeteer = require('puppeteer');

const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};


const clickByText = async function(page, text, element) {
    
    let SELECTOR = "#menu-item-2552 > a" 
  
    await page.waitForNavigation()
    await page.click(SELECTOR);
    await page.screenshot({
    path: './screenshots/pagel.png'
})
}




startScript = async () => {
    try{
        
        const browser = await puppeteer.launch()
     
        const page = await browser.newPage()
     

        await page.goto('http://www.radiosure.com/stations/') 

        let linkSelector = "body > b > b:nth-child(26) > a" 

        console.log("test", linkSelector)
        
        await page.evaluate((linkSelector) => {
            

            var frame = document.querySelector("#post-264 > div > p:nth-child(2) > iframe")
            
            var frameDocument = frame.contentDocument;
    
            frameDocument.querySelector(linkSelector).click();
    
        }, linkSelector);

      

        
        await browser.close()
    } catch (error){
        console.log(error)
    }
}

startScript()