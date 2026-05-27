const app = require('./src/app');
const config = require('./src/config/app.config');

app.listen(config.PORT, () => {
  console.log(`\n🚀  Server started`);
  console.log(`   Environment : ${config.NODE_ENV}`);
  console.log(`   Port        : ${config.PORT}`);
  console.log(`   URL         : http://localhost:${config.PORT}\n`);
});
