const puppeteer = require("puppeteer");

const PROPERTY_VALUE_MIN = 100000;
const PROPERTY_VALUE_MAX = 200000;
const PROPERTY_VALUE_INC = 100000;
let credit_scores = ["760","740","720","700","680","660","640",]
let purchase_prices = []
for(let i = 1; i<11; i++){
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
}

startScript = async () => {

  
  try {
    const browser = await puppeteer.launch();
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
      await page.waitFor(3000);
      await page.screenshot({
        path: "./screenshots/beforeEnhance.png",
      })
      await page.focus("#mortgage-show-cash-out-btn")
      await page.waitForSelector("#mortgage-show-cash-out-btn")
      await page.click("#mortgage-show-cash-out-btn");

      // This block of code changes the credit score selection


      await page.waitForSelector(
        "#__render-farm > div > div > div > aside > div > form > section > div.pt3-l.pt4.ph3.pb2.flex-shrink-0 > div:nth-child(3) > label > div.galaxy-forms-dropdown-root > select"
      );

      console.log("what is new credit SCore", credit_score)
      await page.$eval(
        "#__render-farm > div > div > div > aside > div > form > section > div.pt3-l.pt4.ph3.pb2.flex-shrink-0 > div:nth-child(3) > label > div.galaxy-forms-dropdown-root > select",
        (el,my_value) => el.value = my_value,credit_score
      );
      // end of block that changes credit score selection
      await page.waitFor(3000);
      await page.screenshot({
        path: "./screenshots/afterPop.png",
      })
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
      await page.$eval(
        "input[data-testid=search-form-loanPrograms-input-30-year-fixed]",
        (el,is_checked) => (el.checked = is_checked),is_30_checked
      );
    //   await page.$eval(
    //     "input[data-testid=search-form-loanPrograms-input-20-year-fixed]",
    //     (el,is_checked) => (el.checked = is_checked),!is_30_checked
    //   );
      await page.$eval(
        "input[data-testid=search-form-loanPrograms-input-15-year-fixed]",
        (el,is_checked) => (el.checked = is_checked),is_30_checked
      );
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
      await page.click("#mortgage-check-rates-btn")

      const getThemAll = await page.$$("ckm_detail-module_detailValue--21DrW b");
      console.log("gta", getThemAll);

      getThemAll.forEach(async (rate) => {
        rate = await page.evaluate((el) => el.textContent, rate);
        console.log("rate is", rate);
      });

      console.log("DONE WITH BLOCK")

      await page.screenshot({
        path: "./screenshots/printRates.png",
      })


      
    } // end FOR
    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

startScript();
