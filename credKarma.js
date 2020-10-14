const puppeteer = require("puppeteer");

const PROPERTY_VALUE_MIN = 100000;
const PROPERTY_VALUE_MAX = 200000;
const PROPERTY_VALUE_INC = 100000;

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

startScript = async () => {
  try {
    const browser = await puppeteer.launch();

    for (let state_value_tuple of state_values) {
      let state_value = state_value_tuple[0];

      console.log("state value is", state_value);
      let url = `https://www.creditkarma.com/home-loans/mortgage-rates`;
      const page = await browser.newPage();
      console.log("url is", url);

      await page.goto(url);

      await page.waitForSelector(
        "#__render-farm > div > div > div > div.ck-modal-root.flex.justify-center.overflow-y-auto.items-center.ck-modal-enter-done > div.ck-modal-body.z-1.bg-white.w-100.pa2.pa4-ns.overflow-y-auto.relative.absolute--fill > div > div:nth-child(2) > button"
      )
        let got_it_button2 = await page.$(
        "#__render-farm > div > div > div > div.ck-modal-root.flex.justify-center.overflow-y-auto.items-center.ck-modal-enter-done > div.ck-modal-body.z-1.bg-white.w-100.pa2.pa4-ns.overflow-y-auto.relative.absolute--fill > div > div:nth-child(2) > button"
      )

      let got_it_button2_connected = await page.evaluate((el) => el.isConnected, got_it_button2);
      
      await page.screenshot({
        path: "./screenshots/pagel1.png",
      })
      console.log("is there a got it button?", got_it_button2_connected)
      if(got_it_button2_connected){
        await page.click("#__render-farm > div > div > div > div.ck-modal-root.flex.justify-center.overflow-y-auto.items-center.ck-modal-enter-done > div.ck-modal-body.z-1.bg-white.w-100.pa2.pa4-ns.overflow-y-auto.relative.absolute--fill > div > div:nth-child(2) > button")
        console.log("Should appear if there is a button for git it")
      }
      await page.waitFor(3000);
      await page.screenshot({
        path: "./screenshots/pagel2.png",
      })
      await page.addStyleTag({ content: "*{scroll-behavior: auto !important;}" })

      // click enchance search immediately so we can add more fields
      await page.waitFor(3000);
      await page.focus("#mortgage-show-cash-out-btn")
      await page.waitForSelector("#mortgage-show-cash-out-btn")
      await page.click("#mortgage-show-cash-out-btn");

      // This block of code changes the credit score selection
      let test = "640";

      // This block of code changes the credit score selection
      await page.waitForSelector(
        "#__render-farm > div > div > div > aside > div > form > section > div.pt3-l.pt4.ph3.pb2.flex-shrink-0 > div:nth-child(3) > label > div.galaxy-forms-dropdown-root > select"
      );
      await page.$eval(
        "#__render-farm > div > div > div > aside > div > form > section > div.pt3-l.pt4.ph3.pb2.flex-shrink-0 > div:nth-child(3) > label > div.galaxy-forms-dropdown-root > select",
        (el, my_value) => {
          el.value = my_value;
          console.log("what is my value", my_value);
        },
        test
      );
      // end of block that changes credit score selection

      // This block of code gets and sets the purchase price to an updated value
      let custom_price = "400000"
      await page.$eval(
        "input[data-testid=search-form-purchasePrice-input]",
        (el,new_val) => (el.value = new_val),custom_price
      );

    //   let updated_prop_val_element = await page.$("input[class=propertyvalue]");

    //   updated_prop_val_element = await page.evaluate(
    //     (el) => el.value,
    //     updated_prop_val_element
    //   );

    //   console.log("updated, ", updated_prop_val_element);
      // end of setting purchase price

      //This block of code sets the down payment amount

      let custom_down_payment = "60000"
      await page.$eval(
        "input[data-testid=search-form-downPayment-input]",
        (el,new_val) => (el.value = new_val),custom_down_payment
      );

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

      

      // after we set all our fields and click get my rates, we might encounter a popup that says there are no available loans, we will press "got it" and continue

      
        await page.waitForSelector(
        "#__render-farm > div > div > div > div.ck-modal-root.flex.justify-center.overflow-y-auto.items-center.ck-modal-enter-done > div.ck-modal-body.z-1.bg-white.w-100.pa2.pa4-ns.overflow-y-auto.relative.absolute--fill > div > div:nth-child(2) > button"
      );
        let got_it_button = await page.$(
        "#__render-farm > div > div > div > div.ck-modal-root.flex.justify-center.overflow-y-auto.items-center.ck-modal-enter-done > div.ck-modal-body.z-1.bg-white.w-100.pa2.pa4-ns.overflow-y-auto.relative.absolute--fill > div > div:nth-child(2) > button"
      );
      if(got_it_button.isConnected){
        page.click("#__render-farm > div > div > div > div.ck-modal-root.flex.justify-center.overflow-y-auto.items-center.ck-modal-enter-done > div.ck-modal-body.z-1.bg-white.w-100.pa2.pa4-ns.overflow-y-auto.relative.absolute--fill > div > div:nth-child(2) > button");
      }

      
      
      await browser.close();
    } // end FOR
  } catch (error) {
    console.log(error);
  }
};

startScript();
