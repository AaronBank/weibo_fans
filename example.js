const puppeteer = require('puppeteer')
let pages = []

const scans = [
  'https://www.weibo.com/p/1005052397873730/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005052136693524/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005056384354066/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005053104219203/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005055076590847/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005051801805054/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005051497346202/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005053805496808/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005053985336332/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005051306601321/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005056384354066/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005052478284397/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
  'https://www.weibo.com/p/1005053844589279/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
]

const onFocus = async (page, scan, count, index, browser) => {
  if (count > 5) {
    if (index === scans.length - 1) {
      await browser.close()
      console.log('完成~~~')
    }

    return false
  }

  const newScan = scan.replace(/(page=)([^&]*)/gi, 'page=' + count)

  await page.goto(newScan, {waitUntil: 'networkidle2'})

  await page.waitFor(20000)
  const oAs = await page.$$('a[action-type="follow"]')

  for (let key in oAs) {
    await oAs[key].click()
    await page.waitFor(15501 + index)
  }

  await page.screenshot({path: `snapshot${index}-${count}.png`})

  await onFocus(page, scan, ++count, index, browser)
}

;(async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  page.setViewport({
    width: 1440,
    height: 768,
  })

  await page.goto('https://www.weibo.com/', {waitUntil: 'networkidle2'})

  await page.waitFor(10000)
  await page.screenshot({path: '登陆页面.png'})
  await page.type('#loginname', '18301496816')
  await page.type('input[type="password"]', 'linzi295??')
  await page.screenshot({path: '账号密码.png'})

  const oButton = await page.$('a[action-type="btn_submit"]')

  await oButton.click()
  await page.waitFor(6000)

  await page.screenshot({path: '登陆后页面.png'})

  await page.waitFor(6000)

  await scans.forEach(async (scan, index) => {
    const newPages = await browser.newPage()
    newPages.setViewport({
      width: 1440,
      height: 768,
    })

    await newPages.waitFor(6000 * (index + 3))

    await onFocus(newPages, scan, 1, index, browser)
  })
})()
