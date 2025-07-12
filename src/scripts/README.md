# Scripts

## Date Conversion Script

### `convert:dates`

This script converts dates previously stored as Manila UTC (8 hours ahead) back to plain UTC.

#### Usage

```bash
npm run convert:dates
```

#### What it does

1. Connects to the MongoDB database
2. Fetches all Task documents
   - Converts `dueDate`, `createdAt`, and `updatedAt` from Manila UTC to plain UTC
3. Fetches all TeamMemberTask documents
   - Converts `assignedDate`, `startedDate`, and `completionDate` from Manila UTC to plain UTC
4. Saves the updated documents back to the database

#### Precautions

- Ensure you have a backup of your database before running this script
- Run this script in a staging or test environment first
- Verify the converted dates after running the script

#### Background

Previously, dates were stored by adding 8 hours to convert them to Manila time. 
This script reverts those dates back to their original UTC timestamps.
