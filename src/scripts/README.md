# Scripts

## Date Conversion Script

### `convert:dates`

This script converts all Task and TeamMemberTask date fields from Manila time to UTC.

#### Usage

```bash
npm run convert:dates
```

#### What it does

1. Connects to the MongoDB database
2. Fetches all Task documents
   - Converts `dueDate`, `createdAt`, and `updatedAt` to UTC
3. Fetches all TeamMemberTask documents
   - Converts `assignedDate`, `startedDate`, and `completionDate` to UTC
4. Saves the updated documents back to the database

#### Precautions

- Ensure you have a backup of your database before running this script
- Run this script in a staging or test environment first
- Verify the converted dates after running the script
