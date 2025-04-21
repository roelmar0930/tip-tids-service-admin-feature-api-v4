const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');

router.get('/event', ReportController.getEventReport);
router.get('/event/:id/invitedTeamMember', ReportController.getEventInvitedTeamMembers);
router.get('/event/compliance', ReportController.getComplianceReport);

module.exports = router;
