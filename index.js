const puppeteer = require('puppeteer')
console.log("test")

startScript = async () => {
    try{
        console.log("test")
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.goto('https://medium.com/robots.txt')

        await page.screenshot({
            path: './screenshots/pagel.png'
        })
        await page.pdf({ path: './pdfs/page1.pdf'})

        await browser.close()
    } catch (error){
        console.log(error)
    }
}

startScript()