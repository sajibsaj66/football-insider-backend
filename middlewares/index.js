const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(express.static('public'))

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
}