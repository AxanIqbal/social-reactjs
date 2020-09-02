const fs = require("fs");
const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/user');
const getCoordsForAddress = require("../util/location");
const mongoose = require('mongoose');

async function getPlaceById(req, res, next) {
    const placeId = req.params.pid; // { pid: 'p1' }

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (e) {
        return next(new HttpError("Something went wrong, could not find a place", 500));
    }

    if (!place) {
        return next(new HttpError('Could not find a place for the provided id.', 404));
    }

    await res.json({place: place.toObject({getters: true})}); // => { place } => { place: place }
}

async function getPlacesByUserId(req, res, next) {
    const userId = req.params.uid;

    let userWithPlaces;
    try {
        userWithPlaces = await User.findOne({userName: userId}).populate('places');
        // userWithPlaces = await User.findOne({userName: userId}).populate('places');
    } catch (e) {
        return next(new HttpError(
            'Fetching places failed, please try again later',
            500
        ));
    }

    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        return next(
            new HttpError('Could not find places for the provided user id.', 404)
        );
    }

    await res.json({place: userWithPlaces.places.map(place => place.toObject({getters: true}))});
}

async function createPlace(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs", 422));
    }
    const {title, description, address} = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }
    // coordinates = {
    //     lat: 40.7484474,
    //     lng: -73.9871516
    // };

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: req.file.path,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (e) {
        return next(new HttpError("Creating place failed, please try again user find", 500))
    }

    if (!user) {
        return next(new HttpError("Could not find user for provided id", 404))
    }

    try {
        await createdPlace.save();
        user.places.push(createdPlace);
        await user.save();
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again. ' + err,
            500
        );
        return next(error);
    }

    await res.status(201).json({place: createdPlace});
}

async function updatePlace(req, res, next) {
    console.log(req.body);
    const {title, description, address} = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (e) {
        return next(new HttpError(
            'Something went wrong, could not update place',
            500
        ))
    }

    if (place.creator.toString() !== req.userData.userId) {
        return next(new HttpError(
            'You are not allowed to edit this place.',
            401
        ));
    }

    try {
        place = await Place.findByIdAndUpdate(placeId, {
            title: title,
            description: description,
            address: address
        });
    } catch (e) {
        return next(new HttpError("Something went wrong, could not update place", 500));
    }

    await res.status(200).json({place: place.toObject({getters: true})});
}

async function deletePlace(req, res, next) {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete place.',
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError('Could not find place for this id.', 404);
        return next(error);
    }

    if (place.creator.id.toString() !== req.userData.userId){
        return next(new HttpError(
            'You are not allowed to delete this place.',
            401
        ));
    }

    const imagePath = place.image;

    try {
        // const sess = await mongoose.startSession();
        // sess.startTransaction();
        await place.remove();
        await place.creator.places.pull(place);
        await place.creator.save();
        // await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete place.',
            500
        );
        return next(error);
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    });

    await res.status(200).json({message: 'Deleted place.'});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;