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

      // This block of code changes the credit score selection
      let test = "640"

      // This block of code changes the credit score selection
      await page.waitForSelector("#__render-farm > div > div > div > aside > div > form > section > div.pt3-l.pt4.ph3.pb2.flex-shrink-0 > div:nth-child(3) > label > div.galaxy-forms-dropdown-root > select");
      await page.$eval(
        "#__render-farm > div > div > div > aside > div > form > section > div.pt3-l.pt4.ph3.pb2.flex-shrink-0 > div:nth-child(3) > label > div.galaxy-forms-dropdown-root > select",
        (el, my_value) => {
            el.value = my_value
            console.log("what is my value", my_value)
        }, test
            
        )
      ;
      await page.waitFor(2000)
      await page.screenshot({
        path: './screenshots/pagel.png'
    })

    await browser.close();

      
    } // end FOR
  } catch (error) {
    console.log(error);
  }
};

startScript();
