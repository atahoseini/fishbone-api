mkdir fishbone-express
cd fishbone-express
npm init -y
npm install sqlite3
npm install express sqlite3 body-parser swagger-ui-express
node app.js

## swagger 
npm install
node swagger.js  // This will generate the combined Swagger file
node app.js

## CORS Middleware
npm install cors
