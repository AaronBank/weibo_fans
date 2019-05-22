const puppeteer = require('puppeteer');
let pages = []

const scans = [
	'https://weibo.com/p/1005053844589279/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
	'https://weibo.com/p/1005052478284397/follow?relate=fans&page=2#Pl_Official_HisRelation__59',
	'https://weibo.com/p/1005056384354066/follow?relate=fans&page=2#Pl_Official_HisRelation__59'
]


const onFocus = async (page, scan, count, index, browser) => {
	if (count > 5) {
		if (index === scans.length - 1) {
			browser.close()
			console.log('完成~~~')
		}

		return false
	} 

	const newScan = scan.replace(/(page=)([^&]*)/gi, 'page='+count);

	await page.goto(newScan, {waitUntil: 'networkidle2'});

	const oAs = await page.$$('a[action-type="follow"]');
	
	for (let key in oAs) {
		await oAs[key].click()
	}

	await page.screenshot({path: `snapshot${index}-${count}.png`});

	await onFocus(page, scan, ++count, index, browser)
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
	await page.goto('https://passport.weibo.cn/signin/login', {waitUntil: 'networkidle2'});

	await page.screenshot({path: '登陆页面.png'});

	await page.type('#loginName', 'aaa');    
	await page.type('#loginPassword', 'aaaa');

	await page.screenshot({path: '账号密码.png'});

	const oButton = await page.$('#loginAction')
	await oButton.click();

	scans.forEach(async (scan, index) => {
		const newPages = await browser.newPage();
		
		setTimeout(async() => {
			await onFocus(newPages, scan, 1, index, browser)
		}, (index+1) * 8000)
	})
})();

