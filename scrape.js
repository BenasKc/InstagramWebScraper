const puppeteer = require('puppeteer')
const readline = require('readline')
const WAIT_TIME = 800
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  crlfDelay: Infinity
})
async function scrape (url, username, password) {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(url)

  const agree = await page.$x('/html/body/div[2]/div/div/div/div[2]/button[1]')
  await agree[0].click()
  await page.waitForSelector('input[name=username]')
  await page.type('input[name=username]', username)
  await page.type('input[name=password]', password)
  const login = await page.$x('//*[@id="loginForm"]/div/div[3]/button')
  await login[0].click()
  await page.waitForXPath('/html/body/div[4]/div/div/div/div[3]/button[2]')
  const nofs = await page.$x('/html/body/div[4]/div/div/div/div[3]/button[2]')
  await nofs[0].click()
  await page.goto('https://www.instagram.com/benqasas')
  await page.waitForXPath(
    '//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a'
  )
  const followers = await page.$x(
    '//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a'
  )
  const followerscount = await followers[0].getProperty('textContent')
  const follintstr = followerscount._remoteObject.value
  const follint = follintstr.split(' ')
  await followers[0].click()
  var followersarr = []
  const jqa = 'html > body > div > div > div > div:nth-child(2)'
  const folldiv = await page.$(
    'html > body > div > div > div > div:nth-child(2)'
  )
  var count = follint[0] * 54
  var pastscrollheight = 0
  var iai = 0
  await page.waitForTimeout(WAIT_TIME)
  follint[0] = +5 + +follint[0]
  while (1) {
    await page.evaluate(async () => {
      document
        .querySelector('html > body > div > div > div > div:nth-child(2)')
        .scrollBy(0, 400)
    })
    const scrollheight = await page.evaluate(async () => {
      return document.querySelector(
        'html > body > div > div > div > div:nth-child(2) > ul'
      ).offsetHeight
    })
    if (scrollheight === pastscrollheight) {
      iai++
    } else {
      iai = 0
    }
    if (iai >= WAIT_TIME) {
      break
    }
    pastscrollheight = scrollheight
  }
  for (var i = 1; i <= follint[0]; i++) {
    var a1 = await page.$x(
      '/html/body/div[5]/div/div/div[2]/ul/div/li[' +
        i.toString() +
        ']/div/div[1]/div[2]/div[1]/span/a'
    )
    if (typeof a1 === 'undefined' && a1.length === 0) {
      a1 = await page.$x(
        '/html/body/div[5]/div/div/div[2]/ul/div/li[' +
          i.toString() +
          ']/div/div[1]/div[1]/div[1]/div/span/a'
      )
    }
    try {
      const a3 = await page.evaluate(element => element.textContent, a1[0])
      followersarr.push(a3)
    } catch {
      if (+follint[0] - +5 >= follint[0]) {
        console.log(`Failed to extract at following ${i.toString()}`)
      }
    }
  }
  page.waitForTimeout(WAIT_TIME)
  await page.goto('https://www.instagram.com/benqasas')
  const following = await page.$x(
    '//*[@id="react-root"]/section/main/div/header/section/ul/li[3]/a'
  )
  const followingcount = await following[0].getProperty('textContent')
  const folliwntstr = followingcount._remoteObject.value
  const folliwnt = folliwntstr.split(' ')
  await following[0].click()
  var count = folliwnt[0] * 54
  var pastscrollheight2 = 0
  var iai2 = 0
  var followingarr = []
  await page.waitForTimeout(WAIT_TIME)
  while (1) {
    await page.evaluate(async () => {
      document
        .querySelector('html > body > div > div > div > div:nth-child(3)')
        .scrollBy(0, 400)
    })
    const scrollheight = await page.evaluate(async () => {
      return document.querySelector(
        'html > body > div > div > div > div:nth-child(3) > ul'
      ).offsetHeight
    })
    if (scrollheight === pastscrollheight2) {
      iai2++
    } else {
      iai2 = 0
    }
    if (iai2 >= WAIT_TIME) {
      break
    }
    pastscrollheight2 = scrollheight
  }
  folliwnt[0] = +5 + +folliwnt[0]
  for (var i = 1; i <= folliwnt[0]; i++) {
    var a1 = await page.$x(
      '/html/body/div[5]/div/div/div[2]/ul/div/li[' +
        i.toString() +
        ']/div/div[1]/div[2]/div[1]/span/a'
    )
    if (typeof a1 === 'undefined' && a1.length === 0) {
      a1 = await page.$x(
        '/html/body/div[5]/div/div/div[2]/ul/div/li['+i.toString()+']/div/div[2]/div/div/div/span/a'
      )
    }
    if (a1.length === 0) {
      a1 = await page.$x(
        '/html/body/div[5]/div/div/div[2]/ul/div/li[' +
          i.toString() +
          ']/div/div[1]/div[2]/div[1]/span/a'
      )
    }
    try {
      const a3 = await page.evaluate(element => element.textContent, a1[0])
      followingarr.push(a3)
    } catch {
      if (+folliwnt[0] - +5 >= folliwnt[0]) {
        console.log(`Failed to extract at following ${i.toString()}`)
      }
    }
  }
  browser.close()
  for (var i = 0; i < followingarr.length; i++) {
    var isthere = 0
    for (var j = 0; j < followersarr.length; j++) {
      if (followersarr[j] === followingarr[i]) {
        isthere = 1
        break
      }
    }
    if (isthere === 0) {
     rl.write(`${followingarr[i]} doesn't follow you back \n`)
    }
  }
}
function GetInfo () {
  var username
  var password
  rl.question('Enter instagram username: ', answer => {
    username = answer
    
    console.log('Enter instagram password: ')
    rl.stdoutMuted = true
    rl.question( "\n", function(answer2) {
      password = answer2
      rl.stdoutMuted = false
      scrape('https://www.instagram.com', username, password)
      rl.close()
    })
  })
}
rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted && stringToWrite != '\r\n' &&  stringToWrite != '\n' && stringToWrite != '\r')
    rl.output.write("*");
  else
    rl.output.write(stringToWrite);
};
GetInfo()

