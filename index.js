require('dotenv').config();
const app = require('./src/app');
const DB = require('./src/data-source');

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await DB.connectToDataBase();
        console.log('Database connection Open!');
        app.listen(PORT, () => {
            console.log(`Server Started at port :: ${PORT}`)
        })
    }
    catch (e) {
        console.log('Cannot Start the server at the moment', e);
    }

})();


