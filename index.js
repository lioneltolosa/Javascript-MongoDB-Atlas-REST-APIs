let express = require('express');
let app = express();
let pieRepo = require('./repositories/productsRepo')
let cors = require('cors');
// Helper Errors
let errorHelper = require('./helpers/errorHelpers');

// Use the express Router object
let router = express.Router();

// Configure middleware to support JSON data parsing in request object
app.use(express.json());

app.use(cors());

// << db setup >>
const db = require("./conection/db");
const dbName = "data";
const collectionName = "music";

db.initialize(dbName, collectionName, (dbCollection) => {
    // get all items
    dbCollection.find().toArray((err, result) => {
        if (err) throw err;
          console.log(result);
    });

    // << db CRUD routes >>

    router.get('/', (req, res, next) => {
        dbCollection.find().toArray()
            .then(data => {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "All pies retrieved.",
                    "data": data
                });
            }, (err) => {
                next(err);
            })
    });

    router.post('/', function (req, res, next) {
        dbCollection.insertOne(req.body)
        .then(data => {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "All pies retrieved.",
                "data": data
            });
        }, (err) => {
            next(err);
        })
    })

}, (err) => { // failureCallback
    throw (err);
});

// Create GET to return a list of all pies


// Create GET/search?id=n&name=str to search for pies by 'id' and/or 'name'
router.get('/search', function (req, res, next) {
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };

    pieRepo.search(searchObject, function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "All pies retrieved.",
            "data": data
        });
    }, function (err) {
        next(err);
    });
});

// Create GET/id to return a single pie
router.get('/:id', function (req, res, next) {
    pieRepo.getById(req.params.id, function (data) {
        if (data) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "All pies retrieved.",
                "data": data
            });
        }
        else {
            res.status(404).send({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
});



router.put('/:id', function (req, res, next) {
    pieRepo.getById(req.params.id, function (data) {
        if (data) {
            // Attempt to update the data
            pieRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "Pie '" + req.params.id + "' updated.",
                    "data": data
                });
            });
        }
        else {
            res.status(404).send({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
})

router.delete('/:id', function (req, res, next) {
    pieRepo.getById(req.params.id, function (data) {
        if (data) {
            // Attempt to delete the data
            pieRepo.delete(req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "The pie '" + req.params.id + "' is deleted.",
                    "data": "Pie '" + req.params.id + "' deleted."
                });
            });
        }
        else {
            res.status(404).send({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
})

router.patch('/:id', function (req, res, next) {
    pieRepo.getById(req.params.id, function (data) {
        if (data) {
            // Attempt to update the data
            pieRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "Pie '" + req.params.id + "' patched.",
                    "data": data
                });
            });
        }
        else {
            res.status(404).send({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."
                }
            });
        }
    }, function (err) {
        next(err);
    });
})

app.use('/api/', router);

// Configure exception logger
app.use(errorHelper.logErrors);
// Configure client error handler
app.use(errorHelper.clientErrorHandler);
// Configure catch-all exception middleware last
app.use(errorHelper.errorHandler);

const PORT = process.env.PORT || 5000;

var server = app.listen(PORT, () => {
    console.log('Node server is running on http://localhost:5000..' + PORT);
});