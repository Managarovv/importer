const app = require('express')()
const puppeteer = require('puppeteer');

async function findMusic(user_id) {
	const browser = await puppeteer.launch({headless: false, slowMo:10});
  	const page = await browser.newPage();
  	await page.setViewport({ width: 1920, height: 1080});
  	await page.goto('https://vk.com');

  	await page.waitForSelector('#index_email');
 	await page.$eval('#index_email', el => el.value = '+4915906769279')
 	await page.click('.VkIdForm__signInButton')

 	await page.waitForTimeout(2000);

	await page.waitForSelector('.vkc__TextField__input')
	await page.type('.vkc__TextField__input', '13Malva.08') //await page.$eval('.vkc__TextField__input', el => el.value = '13Malva.08')
	await page.waitForTimeout(2000);
	await page.click('.vkuiButton__in')

	await page.waitForTimeout(5000);

	//let user_id = '267134417'
	await page.goto(`https://vk.com/audios${user_id}`)

	await page.waitForSelector('.audio_page__audio_rows')
	const music = await page.$('.audio_page__audio_rows')
	const title = await music.$$('div.audio_row__performer_title')

	let listTrack = []

	title.forEach( async (item, index, array) => {
		let track = await item.$eval('a.audio_row__title_inner', el => el.innerText)
		let artist = await item.$eval('div.audio_row__performers', el => el.innerText)
		//console.log(track, artist)
		listTrack.push({'track': track, 'artist':artist})
	})

	await page.waitForTimeout(3000)

	await page.screenshot({path: `${__dirname}/screenshots/tool.png`})
  	await browser.close();

  	return listTrack
}

module.exports = findMusic