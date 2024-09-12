const mongoose = require('mongoose');

let TeamMember;

try {
    TeamMember = mongoose.model('TeamMember', teamMemberSchema, 'TeamMembers');
} catch (error) {
    const { Schema } = mongoose;
    const teamMemberSchema = new Schema({
        workdayId: {
            type: Number
        },
        employeeName: {
            type: String
        },
        practice: {
            type: String
        },
        functionalArea: {
            type: String
        },
        totalStars: {
            type: Number
        },
        starPoints: {
            type: Number
        },
        starsPesoConversion: {
            type: String
        },
        stars2022: {
            type: Number
        },
        stars2023: {
            type: Number
        },
        starPointsDeducted: {
            type: Number
        },
        copPoints: {
            type: Number
        },
        copPesoConversion: {
            type: Number
        },
        cop2022Points: {
            type: Number
        },
        cop2023Points: {
            type: Number
        },
        copPointsDeducted: {
            type: Number
        }
    });

    // to remove the default properties of the JSON that is not needed after POST and set the default id to eventId
    teamMemberSchema.set('toJSON', {
        transform: (doc, ret, options) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    TeamMember = mongoose.model('TeamMember', teamMemberSchema, 'TeamMembers');
}

module.exports = TeamMember;