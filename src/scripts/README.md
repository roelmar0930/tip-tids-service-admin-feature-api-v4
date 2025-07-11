# Script Documentation

This README provides an overview of the scripts available in the `src/scripts` directory.

## 1. updateTeamMemberEventStatus.js

Updates the status of team members for a specific event from "unregistered" to "registered" based on their Workday ID.

### Usage
```
node src/scripts/updateTeamMemberEventStatus.js <path_to_csv_file> <event_id>
```

### Notes
- CSV format: Workday ID,Name (only Workday ID is used)
- Uses MongoDB URI: "mongodb://localhost:27017/tip"

## 2. assignTaskToTeamMember.js

Assigns a specific task to all team members.

### Usage
```
node src/scripts/assignTaskToTeamMember.js <taskId>
```

### Notes
- Checks if the task exists before assigning
- Skips assignment if the task is already assigned to a team member

## 3. updateRegistrationCodes.js

Updates registration codes for events that don't have one.

### Usage
```
node src/scripts/updateRegistrationCodes.js
```

### Notes
- Generates a unique code based on the event title
- Updates events with missing registration codes

## 4. updateRoles.js

Updates roles of team members based on their job profiles.

### Usage
```
node src/scripts/updateRoles.js
```

### Notes
- Sets roles: teamManager, teamLeader, admin, teamMember
- Uses regex to match job profiles

## 5. updateTeamMemberCollection.js

Updates or adds team members to the collection based on a CSV file.

### Usage
```
node src/scripts/updateTeamMemberCollection.js <path_to_csv_file>
```

### Notes
- Updates existing members or adds new ones
- Requires workEmailAddress and workdayId in the CSV

## 6. updateTeamMemberWorkdayId.js

This script was not provided in the list, but it's mentioned in the directory. Its purpose is likely to update Workday IDs for team members.

## General Notes

- All scripts require a connection to MongoDB
- Ensure you have the necessary dependencies installed (mongoose, csv-parser for some scripts)
- Make sure to replace placeholder MongoDB URIs with your actual database connection string
- Always backup your data before running update scripts

For more detailed information about each script, please refer to the individual script files.
