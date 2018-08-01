let Car = require('../models/carModel')

let getAllcars = async(req, res) => {
    try {
        let query = {};
        if (req.query.brend)
            query.brend = req.query.brend;
        let books = await Car.find(query);
        if (books.length > 0)
            res.json(books);
        else
            res.status(404).send({ error: "No cars" });
    } catch (err) {
        res.status(500).send(err);
    }
}

let carAdd = async(req, res) => {
    try {
        let car = new Car(req.body);
        await car.save();
        res.json(car);
    } catch (err) {
        res.status(500).send(err);
    }
}

let getCarById = async(req, res, next) => {
    let id = req.params.id;
    try {
        let car = await Car.findById(id);
        if (car) {
            req.car = car;
            next();
        } else res.status(404).send({ error: "Not Found" });
    } catch (err) {
        res.status(500).send(err);
    }
}

let updateAllCarFields = async(req, res) => {
    req.car.brend = req.body.brend;
    req.car.name = req.body.name;
    req.car.power = req.body.power;
    req.car.year = req.body.year;
    req.car.type = req.body.type;
    req.car.save();
    res.json(req.car);
}
let updateSomeFields = async(req, res) => {
    if (req.body._id) delete req.body._id;
    for (let property in req.body) {
        req.car[property] = req.body[property];
    }
    try {
        await req.car.save();
        res.json(req.car);
    } catch (err) {
        res.status(500).send(err)
    }
}

let deleteById = async(req, res) => {
    try {
        let car = await Car.remove({ _id: req.params.id })
        res.json(car);
    } catch (err) {
        res.status(500).send(err);
    }
}




module.exports = {
    getAllcars,
    carAdd,
    getCarById,
    updateAllCarFields,
    updateSomeFields,
    deleteById
};