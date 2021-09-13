import getGroupMembers from './getGroupMembers';

import { createObjectCsvWriter } from 'csv-writer';

export default async(id) => {
    let groupCounts = await getGroupMembers();
    let index = groupCounts.indexOf(Math.min(...groupCounts));

    const csvWriter = createObjectCsvWriter({
        path: './src/db/groups.csv',
        header: [
            { id: 'id', title: 'id' },
            { id: 'group', title: 'group' },
        ]
    });

    const records = [{ id: id, group: index }];

    await csvWriter.writeRecords(records);

};