module.exports = {
	testing: true,
	dashboard: {
		ip: '45.142.122.184', //45.142.122.184 // 127.0.0.1
		safe: "https",
		api: 'api.scpsl.shop',
		connect: 'connect.scpsl.shop',
		baseURL: "localhost",//scpsl.shop  localhost beta.scpsl.shop
		cdn: "https://cdn.scpsl.shop",
		socketio: 'https://socket.scpsl.shop'
	},
	payments: {
		public: '',
		secret: '',
	},
	paypalych: {
		shop: '',
		token: '',
	},
	yoomoney: {
		wallet: '',
		secret: '+nOx9FT',
	},
	yookassa: {
		shopId: 0,
		token: Buffer.from("").toString('base64')
	},
	qiwiP2P: '',
	donationPay: {
		id: 0,
		token: ''
	},
	donationAlerts: {
		id: 0,
		token: '-b--------',
	},
	boosty: {
		payerToken: '',
		receiverNick: '',
		reveiverPost:0
	},
	cryptomus: {
		merchant: '',
		key: '',
	},
	freekassa: {
		shop: 0,
		public: '',
		private: '',
	},
	rapidBinKey: '', // https://rapidapi.com/trade-expanding-llc-trade-expanding-llc-default/api/bin-ip-checker/
	SteamAPI: '',
	token: '',
	mongoDB: "mongodb://fydne:@.:27020/login?authSource=admin",
	mongoSystem: 'mongodb://root:@./system?authSource=admin'
}