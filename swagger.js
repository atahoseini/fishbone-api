const fs = require('fs');
const path = require('path');

const swaggerBase = require('./swagger/swaggerBase.json');
const orderPaths = require('./swagger/order.json');
const productPaths = require('./swagger/product.json');
const userPaths = require('./swagger/user.json');

swaggerBase.paths = {
  ...swaggerBase.paths,
  ...orderPaths.paths,
  ...productPaths.paths,
  ...userPaths.paths,
};

swaggerBase.components.schemas = {
  ...swaggerBase.components.schemas,
  ...orderPaths.components.schemas,
  ...productPaths.components.schemas,
  ...userPaths.components.schemas,
};

fs.writeFileSync(path.join(__dirname, 'swagger', 'combined.json'), JSON.stringify(swaggerBase, null, 2));
// Run this code aftre add services on route section