const express = require('express')
const app = require('express')()

const vkontacte = require('./vk')

const host =  '192.168.2.32'//'localhost'
const port = process.env.PORT || 3000

app.use('/', express.static(__dirname + '/static'));
app.use('/VK', vkontacte);

app.use((req, res)=>{
	res.status(404).send('error: '+req.url+' cannot be found')
})

app.listen(port, host, function() {
	console.log(`app listen ${port} port`)
})