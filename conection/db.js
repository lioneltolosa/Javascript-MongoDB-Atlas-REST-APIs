const MongoClient = require("mongodb").MongoClient;

/* const dbConnectionUrl = "CONNECTION_STRING_FROM_ATLAS"; */
const dbConnectionUrl = "mongodb+srv://apimusic:apimusic@cluster0.andsw.mongodb.net/<dbname>?retryWrites=true&w=majority"

function initialize(
    dbName,
    dbCollectionName,
    successCallback,
    failureCallback
) {
    MongoClient.connect(dbConnectionUrl, { useUnifiedTopology: true }, (err, dbInstance) => {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`);
            failureCallback(err);
        } else {
            const dbObject = dbInstance.db(dbName);
            const dbCollection = dbObject.collection(dbCollectionName);
            console.log("[MongoDB connection] SUCCESS");

            successCallback(dbCollection);
        }
    });
}

module.exports = {
    initialize
};