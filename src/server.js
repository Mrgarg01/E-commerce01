require('dotenv').config();
const app = require('./app');
const DB = require('./data-source');

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


