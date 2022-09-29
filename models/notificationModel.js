const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    notification: {
        type: String
    },
    header: {
        type: String
    }

}, { timestamps: true })

const notificationModel = mongoose.model('Notification', notificationSchema);

module.exports = notificationModel