const puppeteer = require('puppeteer')

void (async () => {
    try{
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.goto('https://scrapethissite.com/pages/forms')

        await page.screenshot({
            path: './screenshots/pagel.png'
        })
        await page.pdf({ path: './pdfs/page1.pdf'})

        await browser.close()
    } catch (error){
        console.log(error)
    }
})