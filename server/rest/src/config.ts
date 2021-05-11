require('dotenv').config();

export default {
	mongo_uri: process.env.MONGO_URI || '',
	eth_address: process.env.ETH_ADDRESS || '0x510aB08fDC676c733C7b98932719494e748e7Be8',
	senec_address: process.env.SENEC_ADDRESS || '',
	port: parseInt(process.env.PORT || '2984'),
}
