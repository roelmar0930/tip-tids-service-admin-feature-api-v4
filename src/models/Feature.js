const mongoose = require('mongoose');
const { Schema } = mongoose;

const featureSchema = new Schema({
    id: String,
    workdayId: String,
    roleName: String,
    supOrgCd: String,
    feedId: String,
    title: String,
    detail: String,
    pictureUrl: String,
    createdDate: String,
    createdBy: String,
    updatedDate: String,
    updatedBy: String,
    publishedDate: String,
    publishedBy: String,
    eventId: String,    
    venue: String,
    venueDetails: String,
    starsNum: String,    
    startDate: String,
    endDate: String,
    startTime: String,
    endTime: String,
    code: String,
    loggedInTime: String,
    taskReminderId: String,
    optionalInd: String,
    dueDateTime: String,
    completionTime: String,
    reportLogId: String,
    reportUrl: String
});

mongoose.model('features', featureSchema);