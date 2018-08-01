// let should = require('should');
let chai = require('chai');
let chaiHttp = require('chai-http');
let request = require('supertest')
let should = chai.should();
let Car = require('../models/carModel');
let app = require('../../app').app;
let server = require('../../app').server;

chai.use(chaiHttp);




describe('Car Api tests:', () => {

    beforeEach((done) => {
        Car.remove({}, (err) => {
            done();
        });
    });

    after((done) => {
        server.close();
        done();
    });

    describe('/GET', () => {
        it('no objects', (done) => {
            chai.request(app)
                .get('/api/cars')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        it('Bd have 1 object', (done) => {
            let car = new Car({
                brend: "ford",
                name: "focus",
                power: 105,
                year: 2011,
                type: "petrol"
            });
            (async() => {
                await car.save();
            })();
            chai.request(app)
                .get('/api/cars')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });




    describe('/POST car', () => {
        it('POST a car', (done) => {
            let car = {
                brend: "ford",
                name: "focus",
                power: 105,
                year: 2011,
                type: "petrol"
            }
            chai.request(server)
                .post('/api/cars')
                .send(car)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('brend').eql('ford');
                    res.body.should.have.property('name').eql('focus');
                    res.body.should.have.property('power').eql(105);
                    res.body.should.have.property('year').eql(2011);
                    res.body.should.have.property('type').eql("petrol");
                    done();
                });
        });
        it('POST a car without brend field', (done) => {
            let car = {
                name: "focus",
                power: 105,
                year: 2011,
                type: "petrol"
            }
            chai.request(server)
                .post('/api/cars')
                .send(car)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.should.have.property('_message').eql('Car validation failed');
                    done();
                });
        });
    });

    describe('/:id', () => {
        beforeEach((done) => {
            let car = new Car({
                brend: "ford",
                name: "focus",
                power: 105,
                year: 2011,
                type: "petrol"
            });
            (async() => {
                await Car.remove({});
                await car.save();
                done();
            })();
        });
        describe('GET', () => {
            it('GET a car by id', (done) => {
                (async() => {
                    let car = (await Car.find())[0];
                    chai.request(server)
                        .get('/api/cars/' + car._id)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('brend').eql('ford');
                            res.body.should.have.property('name');
                            res.body.should.have.property('power');
                            res.body.should.have.property('year');
                            res.body.should.have.property('type');
                            res.body.should.have.property('_id').eql(car.id);
                            done();
                        });
                })();
            });
            it('GET a car by bad id', (done) => {
                (async() => {
                    chai.request(server)
                        .get('/api/cars/' + "5b619e7cc9567814914862ed")
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.have.property('error').eql('Not Found');
                            done();
                        });
                })();
            });
        });

        describe('PUT', () => {
            it('Update a car by id', (done) => {
                let carUpdate = new Car({
                    brend: "ford1",
                    name: "focus1",
                    power: 125,
                    year: 2012,
                    type: "disel"
                });
                (async() => {
                    let car = (await Car.find())[0];
                    chai.request(server)
                        .put('/api/cars/' + car._id)
                        .send(carUpdate)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('brend').eql('ford1');
                            res.body.should.have.property('name').eql('focus1');
                            res.body.should.have.property('power').eql(125);
                            res.body.should.have.property('year').eql(2012);
                            res.body.should.have.property('type').eql('disel');
                            res.body.should.have.property('_id').eql(car.id);
                            done();
                        });
                })();
            });
            it('PUT a car by bad id', (done) => {
                (async() => {
                    chai.request(server)
                        .put('/api/cars/' + "5b619e7cc9567814914862ed")
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.have.property('error').eql('Not Found');
                            done();
                        });
                })();
            });
        });

        describe('PATCH', () => {
            it('Update a car field by id', (done) => {
                let carUpdate = new Car({
                    brend: "ford1",
                    name: "focus1"
                });
                (async() => {
                    let car = (await Car.find())[0];
                    chai.request(server)
                        .patch('/api/cars/' + car._id)
                        .send(carUpdate)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('brend').eql('ford1');
                            res.body.should.have.property('name').eql('focus1');
                            done();
                        });
                })();
            });
            it('PATCH a car by bad id', (done) => {
                (async() => {
                    chai.request(server)
                        .patch('/api/cars/' + "5b619e7cc9567814914862ed")
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.have.property('error').eql('Not Found');
                            done();
                        });
                })();
            });
        });

        describe('DELETE', () => {
            it('Delete car field by id', (done) => {
                (async() => {
                    let car = (await Car.find())[0];
                    chai.request(server)
                        .delete('/api/cars/' + car._id)
                        .end((err, res) => {
                            res.body.should.have.property('ok').eql(1);
                            done();
                        });
                })();
            });
            it('DELETE a car by bad id', (done) => {
                (async() => {
                    chai.request(server)
                        .delete('/api/cars/' + "5b619e7cc9567814914862ed")
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.have.property('error').eql('Not Found');
                            done();
                        });
                })();
            });
        });
    });

});