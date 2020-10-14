const puppeteer = require('puppeteer');

const PROPERTY_VALUE_MIN = 100000
const PROPERTY_VALUE_MAX = 200000
const PROPERTY_VALUE_INC = 100000

const state_values = [
    ['AK', 'Alaska']
    // ('AL', 'Alabama'),
    // ('AZ', 'Arizona'),
    // ('AR', 'Arkansas'),
    // ('CA', 'California'),
    // ('CO', 'Colorado'),
    // ('CT', 'Connecticut'),
    // ('DE', 'Delaware'),
    // ('FL', 'Florida'),
    // ('GA', 'Georgia'),
    // ('HI', 'Hawaii'),
    // ('ID', 'Idaho'),
    // ('IL', 'Illinois'),
    // ('IN', 'Indiana'),
    // ('IA', 'Iowa'),
    // ('KS', 'Kansas'),
    // ('KY', 'Kentucky'),
    // ('LA', 'Louisiana'),
    // ('ME', 'Maine'),
    // ('MD', 'Maryland'),
    // ('MA', 'Massachusetts'),
    // ('MI', 'Michigan'),
    // ('MN', 'Minnesota'),
    // ('MS', 'Mississippi'),
    // ('MO', 'Missouri'),
    // ('MT', 'Montana'),
    // ('NE', 'Nebraska'),
    // ('NV', 'Nevada'),
    // ('NH', 'New Hampshire'),
    // ('NJ', 'New Jersey'),
    // ('NM', 'New Mexico'),
    // ('NY', 'New York'),
    // ('NC', 'North Carolina'),
    // ('ND', 'North Dakota'),
    // ('OH', 'Ohio'),
    // ('OK', 'Oklahoma'),
    // ('OR', 'Oregon'),
    // ('PA', 'Pennsylvania'),
    // ('RI', 'Rhode Island'),
    // ('SC', 'South Carolina'),
    // ('SD', 'South Dakota'),
    // ('TN', 'Tennessee'),
    // ('TX', 'Texas'),
    // ('UT', 'Utah'),
    // ('VT', 'Vermont'),
    // ('VA', 'Virginia'),
    // ('WA', 'Washington'),
    // ('DC', 'Washington D.C.'),
    // ('WV', 'West Virginia'),
    // ('WI', 'Wisconsin'),
    // ('WY', 'Wyoming')
]
let dummy_rows = []

startScript = async () => {
    try{
        
        const browser = await puppeteer.launch()

        for(let state_value_tuple of state_values){
            
            let state_value = state_value_tuple[0]

            
            
            console.log("state value is", state_value)
            let url = `http://widgets.icanbuy.com/c/standard/us/en/mortgage/tables/Mortgage.aspx?siteid=6a75f115ace46e5c&amp;loan_type=REFI&property_value=${PROPERTY_VALUE_MAX}&state=${state_value}`
            const page = await browser.newPage()
            console.log("url is", url)

            await page.goto(url) 

            await page.waitFor('input[class=propertyvalue]')
            await page.$eval('input[class=propertyvalue]', el => el.value = 'Adenosine triphosphate')

            await page.waitForSelector('#rates > tbody > tr:nth-child(1) > td > table > tbody > tr > td.cell2 > table > tbody > tr > td > span.cell2value1')
            console.log("1")
            let x = await page.$('#rates > tbody > tr:nth-child(1) > td > table > tbody > tr > td.cell2 > table > tbody > tr > td > span.cell2value1')

            x = await page.evaluate(el => el.textContent, x)
             console.log("what is rateField", x)
             

            let prop_val_element = await page.$('input[class=propertyvalue]')

            await page.$eval('input[class=propertyvalue]', el => el.value = '400000')

            let updated_prop_val_element = await page.$('input[class=propertyvalue]')

            updated_prop_val_element = await page.evaluate(el => el.value, updated_prop_val_element)

            console.log("updated, ", updated_prop_val_element)

            
           
            
        
            await browser.close()

        } // end FOR
     
        
    } catch (error){
        console.log(error)
    }
}

startScript()