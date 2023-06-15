/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://terminusdb.com/docs/',
  generateRobotsTxt: true, // (optional)
  output: "export",
  // ...other options
}
