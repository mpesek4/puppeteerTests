const puppeteer = require("puppeteer");

const PROPERTY_VALUE_MIN = 100000;
const PROPERTY_VALUE_MAX = 200000;
const PROPERTY_VALUE_INC = 100000;
let credit_scores = ["760","740","720","700","680","660","640",]
let purchase_prices = []
for(let i = 3; i<11; i++){
  purchase_prices.push(i*100000)
}
let property_types = ["Single family","Multi-family", "Condo", "Townhome","Co-op","Manufactured home"] // index corresponds to value in dropdown on creditkarma
let loan_programs = ["30","20","15","10","7/1","5/1","3/1"]

let inputs = []
for(let cs of credit_scores){ // This loops will create all the permutations we want to scrape on credit karma
  for(let pp of purchase_prices){
    for(let pt of property_types){
      let new_input = [cs,pp,pt]
      inputs.push(new_input)
    }
  }
}
 console.log(inputs.length)

const state_values = [
  ["AK", "Alaska"],
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
];
let dummy_rows = [];

let popupHandler = async (page) => {
  try{
    await page.waitForSelector(
      "#__render-farm > div > div > div > div.ck-modal-root.flex.justify-center.overflow-y-auto.items-center.ck-modal-enter-done > div.ck-modal-body.z-1.bg-white.w-100.pa2.pa4-ns.overflow-y-auto.relative.absolute--fill > div > div:nth-child(2) > button"
    )
      let got_it_button2 = await page.$(
      "#__render-farm > div > div > div > div.ck-modal-root.flex.justify-center.overflow-y-auto.items-center.ck-modal-enter-done > div.ck-modal-body.z-1.bg-white.w-100.pa2.pa4-ns.overflow-y-auto.relative.absolute--fill > div > div:nth-child(2) > button"
    )

    let got_it_button2_connected = await page.evaluate((el) => el.isConnected, got_it_button2);
    
    
    if(got_it_button2_connected){
      await page.click("#__render-farm > div > div > div > div.ck-modal-root.flex.justify-center.overflow-y-auto.items-center.ck-modal-enter-done > div.ck-modal-body.z-1.bg-white.w-100.pa2.pa4-ns.overflow-y-auto.relative.absolute--fill > div > div:nth-child(2) > button")
      console.log("Should appear if there is a button for git it")
    }

  } catch(error){console.log(error)}
   
}

startScript = async () => {

  
  try {
    const browser = await puppeteer.launch({headless: false});
    let url = `https://www.creditkarma.com/home-loans/mortgage-rates`;
    const page = await browser.newPage();
    await page.goto(url);
    console.log("set view")
    await page.setViewport({ width: 1900, height: 1200 })

    for (let input of inputs) {
      let credit_score = input[0]
      let purchase_price = input[1]
      let property_type = input[2]
      

      popupHandler(page)
      
      
      await page.addStyleTag({ content: "*{scroll-behavior: auto !important;}" })

      // click enchance search immediately so we can add more fields
      await page.waitFor(1000);
      await page.screenshot({
        path: "./screenshots/beforeEnhance.png",
      })
      await page.focus("#mortgage-show-cash-out-btn")
      await page.waitForSelector("#mortgage-show-cash-out-btn")
      await page.waitFor(1000);
      await page.click("#mortgage-show-cash-out-btn");
      await page.waitFor(1000);

      // This block of code changes the credit score selection


      await page.waitForSelector(
        "#__render-farm > div > div > div > aside > div > form > section > div.pt3-l.pt4.ph3.pb2.flex-shrink-0 > div:nth-child(3) > label > div.galaxy-forms-dropdown-root > select"
      );
      await page.waitFor(1000);

      console.log("what is new credit SCore", credit_score)

      await page.select('#__render-farm > div > div > div > aside > div > form > section > div.pt3-l.pt4.ph3.pb2.flex-shrink-0 > div:nth-child(3) > label > div.galaxy-forms-dropdown-root > select', 'my-value', "680")
     
    
      // end of block that changes credit score selection
      await page.waitFor(1000);
      
      // This block of code gets and sets the purchase price to an updated value
      console.log("what is new purchase price", purchase_price)
      await page.$eval(
        "input[data-testid=search-form-purchasePrice-input]",
        (el,new_val) => (el.value = new_val),purchase_price
      );
      

    //   let updated_prop_val_element = await page.$("input[class=propertyvalue]");

    //   updated_prop_val_element = await page.evaluate(
    //     (el) => el.value,
    //     updated_prop_val_element
    //   );

    //   console.log("updated, ", updated_prop_val_element);
      // end of setting purchase price

      //This block of code sets the down payment amount

      // let custom_down_payment = "60000"
      // await page.$eval(
      //   "input[data-testid=search-form-downPayment-input]",
      //   (el,new_val) => (el.value = new_val),custom_down_payment
      // );

      // end of setting down payment

      // This block of code sets check marks for the loan programs, ie 30-year fixed, 15-year fixed etc....
      let is_30_checked = true

      // can set these other parameters or loop through certain options later
      // await page.$eval(
      //   "input[data-testid=search-form-loanPrograms-input-30-year-fixed]",
      //   (el,is_checked) => (el.checked = is_checked),is_30_checked
      // );
    //   await page.$eval(
    //     "input[data-testid=search-form-loanPrograms-input-20-year-fixed]",
    //     (el,is_checked) => (el.checked = is_checked),!is_30_checked
    //   );
      // await page.$eval(
      //   "input[data-testid=search-form-loanPrograms-input-15-year-fixed]",
      //   (el,is_checked) => (el.checked = is_checked),is_30_checked
      // );
    //   await page.$eval(
    //     "input[data-testid=search-form-loanPrograms-input-10-year-fixed]",
    //     (el,is_checked) => (el.checked = is_checked),!is_30_checked
    //   );
    //   await page.$eval(
    //     "input[data-testid=search-form-loanPrograms-input-7-1-arm]",
    //     (el,is_checked) => (el.checked = is_checked),!is_30_checked
    //   );
    //   await page.$eval(
    //     "input[data-testid=search-form-loanPrograms-input-5-1-arm]",
    //     (el,is_checked) => (el.checked = is_checked),!is_30_checked
    //   );
    //   await page.$eval(
    //     "input[data-testid=search-form-loanPrograms-input-3-1-arm]",
    //     (el,is_checked) => (el.checked = is_checked),!is_30_checked
    //   );

      //end of setting loan programs

      // click get my rates

      await page.screenshot({
        path: "./screenshots/afterPop.png",
      })

      await page.waitForSelector("#mortgage-check-rates-btn")
      

      await page.waitFor(5000)
      await page.click("#mortgage-check-rates-btn")
      await page.waitFor(5000)
      await page.screenshot({
        path: "./screenshots/newRates.png",
      })
      await page.waitFor(10000)

      let getThemAll = await page.$$('span[class^="ckm_detail-module_detail"]');
      // console.log("gta", getThemAll)

      let field_values = []
      let populateFieldValues = async (getThemAll) => {
        getThemAll.forEach(async (val, idx) => {

          val =  await page.evaluate((el) => el.textContent, val)
          console.log("pushing onto field_values", val)
          field_values.push(val)
        })
        return getThemAll
      }

      getThemAll = await populateFieldValues(getThemAll)
      
      console.log("what are field values", field_values)
      let new_row = []
      for(let i = 0; i< field_values.length;i++){
        if(i % 4 == 0){
          if(i!=0){
            dummy_rows.push(new_row)
          }
          console.log("rate is", field_values[i])
        }
        else if(i % 4 == 1){
          console.log("apr is", field_values[i])
  
        }
        else if(i % 4 == 2){
          console.log("Mo Payment is", field_values[i])
      
        }
        else if(i % 4 == 3){
          console.log("Fees are", field_values[i])
        }
        new_row.push(field_values[i])
      }

      console.log("DONE WITH BLOCK, dummy rows are", dummy_rows)
      popupHandler()
      await page.screenshot({
        path: "./screenshots/printRates.png",
      })

      await browser.close();


      
    } // end FOR
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

startScript();
