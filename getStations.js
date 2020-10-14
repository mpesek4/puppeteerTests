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
      let url = `http://widgets.icanbuy.com/c/standard/us/en/mortgage/tables/Mortgage.aspx?siteid=6a75f115ace46e5c&amp;loan_type=REFI&property_value=${PROPERTY_VALUE_MAX}&state=${state_value}`;
      const page = await browser.newPage();
      console.log("url is", url);

      await page.goto(url);

      // This block of code changes the credit score selection
      await page.waitForSelector("#fico_650 > span");
      await page.$eval(
        "#fico_650 > span",
        (el) => (el.textContent = "Good (700-719)")
      );

      // end of setting credit score

      //This block of code selects loan purpose (purchase or refinance)
      await page.waitForSelector("#loanpurpose650 > span");
      await page.$eval(
        "#loanpurpose650 > span",
        (el) => (el.textContent = "Refinance")
      );

      // end of block for selecting loan purpose

      // block for selecting loan products, right now all this does is uncheck 15%, can configure it later to select different options
      await page.waitForSelector("#Checkbox2");
      let isChecked = await page.$eval("#Checkbox2", (el) => (el.checked = ""));

      console.log("is checked?", isChecked);
      // end of loan products

      await page.waitForSelector(
        "#rates > tbody > tr:nth-child(1) > td > table > tbody > tr > td.cell2 > table > tbody > tr > td > span.cell2value1"
      );
      console.log("1");
      let x = await page.$(
        "#rates > tbody > tr:nth-child(1) > td > table > tbody > tr > td.cell2 > table > tbody > tr > td > span.cell2value1"
      );

      x = await page.evaluate((el) => el.textContent, x);
      console.log("what is rateField", x);

      // This block of code gets and sets the purchase price to an updated value

      await page.$eval(
        "input[class=propertyvalue]",
        (el) => (el.value = "400000")
      );

      let updated_prop_val_element = await page.$("input[class=propertyvalue]");

      updated_prop_val_element = await page.evaluate(
        (el) => el.value,
        updated_prop_val_element
      );

      console.log("updated, ", updated_prop_val_element);
      // end of setting purchase price

      // Click the search button after updating fields
      page.click("#btngetrates_650");

      // This block prints all the rates

      const getThemAll = await page.$$("span.cell2value1");
      console.log("gta", getThemAll);

      getThemAll.forEach(async (rate) => {
        rate = await page.evaluate((el) => el.textContent, rate);
        console.log("rate is", rate);
      });
      // end of printing rates

      await browser.close();
    } // end FOR
  } catch (error) {
    console.log(error);
  }
};

startScript();
