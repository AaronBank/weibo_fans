const puppeteer = require('puppeteer');
let pages = []

const scans = [
    "https://www.weibo.com/p/1005052397873730/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005052136693524/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005056384354066/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005053104219203/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005055076590847/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005051801805054/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005051497346202/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005053805496808/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005053985336332/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005051306601321/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005056384354066/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005052478284397/follow?relate=fans&page=2#Pl_Official_HisRelation__59",
    "https://www.weibo.com/p/1005053844589279/follow?relate=fans&page=2#Pl_Official_HisRelation__59"
]

const onFocus = async (page, scan, count, index, browser) => {
	if (count > 5) {
		if (index === scans.length - 1) {
			await browser.close()
			console.log('完成~~~')
		}

		return false
	} 

	const newScan = scan.replace(/(page=)([^&]*)/gi, 'page='+count);

	await page.goto(newScan, {waitUntil: 'networkidle2'});

	await page.waitFor(20000);
	const oAs = await page.$$('a[action-type="follow"]');

	console.log('点击前')
	
	for (let key in oAs) {
		console.log('点击中')
		await page.waitFor(10000);
		await oAs[key].click()
	}

	console.log('点击后')

	await page.screenshot({path: `snapshot${index}-${count}.png`});

	await onFocus(page, scan, ++count, index, browser)
}


(async () => {
	const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  	page.setViewport({
		width: 1440,
		height: 768,
	});

	await page.goto('https://www.weibo.com/', {waitUntil: 'networkidle2'});

	await page.waitFor(10000);
	await page.screenshot({path: '登陆页面.png'});
	await page.type('#loginname', '12');    
	await page.type('input[type="password"]', '1212');

	await page.screenshot({path: '账号密码.png'});
	const oButton = await page.$('a[action-type="btn_submit"]')
	await oButton.click();
	await page.waitFor(10000);

	

	while(page.url() === 'https://weibo.com/'){
		console.log('需要登陆')
	}

	
	await page.waitFor(10000);

	await page.screenshot({path: '登陆页面1111.png'});



	await page.screenshot({path: '登陆后页面.png'});

	await scans.forEach(async (scan, index) => {
		const newPages = await browser.newPage();
		newPages.setViewport({
			width: 1440,
			height: 768,
		});

		await newPages.waitFor(10000 * (index + 3));
		
		await onFocus(newPages, scan, 1, index, browser)
	})
})();



