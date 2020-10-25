const puppeteer = require("puppeteer");

const state_values = [
  ["AK", "99801"],
  ('AL', '36104'),
  ('AZ', '85001'),
  ('AR', '72201'),
  ('CA', '95814'),
  ('CO', '80202'),
  ('CT', '06103'),
  ('DE', '19901'),
  ('FL', '32301'),
  ('GA', '30303'),
  ('HI', '96813'),
  ('ID', '83702'),
  ('IL', '62701'),
  ('IN', '46225'),
  ('IA', '50309'),
  ('KS', '66603'),
  ('KY', '40601'),
  ('LA', '70802'),
  ('ME', '04330'),
  ('MD', '21401'),
  ('MA', '02201'),
  ('MI', '48933'),
  ('MN', '55102'),
  ('MS', '39205'),
  ('MO', '65101'),
  ('MT', '59623'),
  ('NE', '68502'),
  ('NV', '89701'),
  ('NH', '03301'),
  ('NJ', '08608'),
  ('NM', '87501'),
  ('NY', '12207'),
  ('NC', '27601'),
  ('ND', '58501'),
  ('OH', '43215'),
  ('OK', '73102'),
  ('OR', '97301'),
  ('PA', '17101'),
  ('RI', '02903'),
  ('SC', '29217'),
  ('SD', '57501'),
  ('TN', '37219'),
  ('TX', '78701'),
  ('UT', '84111'),
  ('VT', '05602'),
  ('VA', '23219'),
  ('WA', '98507'),
  ('DC', '20001'),
  ('WV', '25301'),
  ('WI', '53703'),
  ('WY', '82001')
];

const PROPERTY_VALUE_MIN = 100000;
const PROPERTY_VALUE_MAX = 200000;
const PROPERTY_VALUE_INC = 100000;
let credit_scores = ["760","740","720","700","680","660","640",]
let purchase_prices = []
for(let i = 3; i<11; i++){
  purchase_prices.push(i*100000)
}
let property_types = ["Single family","Multi-family", "Condo", "Townhome","Co-op","Manufactured home"] // index corresponds to value in dropdown on creditkarma
let loan_programs = ["30","20","15","10","7arm","5arm","3arm"]

let inputs = []
for(let cs of credit_scores){ // This loops will create all the permutations we want to scrape on credit karma
  for(let pp of purchase_prices){
    for(let pt of property_types){
      for(let lp of loan_programs){
        for(let state of state_values){
          let zip_code = state[1]
          let new_input = [cs,pp,pt,lp,zip_code]
          inputs.push(new_input)
        }
        

      }
      
    }
  }
}
 console.log(inputs.length)


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
      let lp = input[3]

      console.log("credit score is", input[0])
      console.log("purchase price is", input[1])
      

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


      let test = "660"
      await page.select('#__render-farm > div > div > div > aside > div > form > section > div.pt3-l.pt4.ph3.pb2.flex-shrink-0 > div:nth-child(3) > label > div.galaxy-forms-dropdown-root > select', `${test}`)
     
    
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
     

      ///can set these other parameters or loop through certain options later

      // lp will be something like "30" or "7/1" we need to set all the others to false and it to true

      

      let is_30_checked = false
      let is_20_checked = false
      let is_15_checked = false
      let is_10_checked = false
      let is_7arm_checked = false
      let is_5arm_checked = false
      let is_3arm_checked = false

      if(lp == "30") is_30_checked = true
      if(lp == "20") is_20_checked = true
      if(lp == "15") is_15_checked = true
      if(lp == "10") is_10_checked = true
      if(lp == "7arm") is_7arm_checked = true
      if(lp == "5arm") is_5arm_checked = true
      if(lp == "3arm") is_3arm_checked = true
      

      await page.$eval(
        "input[data-testid=search-form-loanPrograms-input-30-year-fixed]",
        (el,is_checked) => (el.checked = is_checked),is_30_checked
      );
      await page.$eval(
        "input[data-testid=search-form-loanPrograms-input-20-year-fixed]",
        (el,is_checked) => (el.checked = is_checked),is_20_checked
      );
      await page.$eval(
        "input[data-testid=search-form-loanPrograms-input-15-year-fixed]",
        (el,is_checked) => (el.checked = is_checked),is_15_checked
      );
      await page.$eval(
        "input[data-testid=search-form-loanPrograms-input-10-year-fixed]",
        (el,is_checked) => (el.checked = is_checked),is_10_checked
      );
      await page.$eval(
        "input[data-testid=search-form-loanPrograms-input-7-1-arm]",
        (el,is_checked) => (el.checked = is_checked),is_7arm_checked
      );
      await page.$eval(
        "input[data-testid=search-form-loanPrograms-input-5-1-arm]",
        (el,is_checked) => (el.checked = is_checked),is_5arm_checked
      );
      await page.$eval(
        "input[data-testid=search-form-loanPrograms-input-3-1-arm]",
        (el,is_checked) => (el.checked = is_checked),is_3arm_checked
      );

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
        // getThemAll.forEach(async (val, idx) => {

        //   val =  await page.evaluate((el) => el.textContent, val)
        //   console.log("pushing onto field_values", val)
        //   field_values.push(val)
        // })
        for(let row_val of getThemAll){
          row_val = await page.evaluate((el) => el.textContent, row_val)
          console.log("pushing onto field_values", row_val)
          field_values.push(row_val)
        }
        return getThemAll
      }

      getThemAll = await populateFieldValues(getThemAll)
      
      console.log("what are field values", field_values)
      let new_row = []

      let mo_payment = ""
      let reported_apr=""
      let rate=""
      let lender_fees = ""
      let loan_amount = purchase_price - down_payment

      for(let i = 0; i< field_values.length;i++){
        if(i % 4 == 0){
          if(i!=0){
            dummy_rows.push(new_row)
          }
          console.log("rate is", field_values[i])
          rate = field_values[i]
        }
        else if(i % 4 == 1){
          console.log("apr is", field_values[i])
          reported_apr = field_values[i]
  
        }
        else if(i % 4 == 2){
          console.log("Mo Payment is", field_values[i])
          mo_payment = field_values[i]
      
        }
        else if(i % 4 == 3){
          console.log("Fees are", field_values[i])
          lender_fees = field_values[i]

          let insert_sql = `INSERT INTO testdata.loanScenario (loan_product,loan_amount,state,credit_score,points_credits,lender,interest_rate,loan_purpose, property_type, zip_code,mo_payment,reported_apr) \
                          VALUES (${lp},${loan_amount},${state},${cs}, 0,${third_pty_fees},${rate}, ${lp},${pt}, ${zip_code},${mo_payment},${reported_apr} )`

          console.log("inserting into table", insert_sql)


        }
        new_row.push(field_values[i])

        
      }

      console.log("DONE WITH BLOCK, dummy rows are", dummy_rows)

      
      

      // let insert_sql = 
      // INSERT INTO scrapes.mortgage_news_daily 
      // (insert_dttm, loan_purpose, property_value, loan_balance, state, rate_source, rate)
      // VALUES

      


      

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
