const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

module.exports = {
    rootPath: path.resolve(__dirname, '..'),
    serviceName: process.env.SERVICE_NAME,
    urlDB: process.env.MONGO_URL,
    s3AccesKey: process.env.AWS_ACCESS_KEY_ID,
    s3SecretAccesKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3BucketRegion: process.env.AWS_BUCKET_REGION
}