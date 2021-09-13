import csv from 'csv-parser';
import fs from 'fs';

export default () => {
    let groups = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ];
    return new Promise((resolve, reject) => {
        reject;
        fs.createReadStream('./src/db/groups.csv')
            .pipe(csv())
            .on('data', row => {
                groups[Number(row.group) - 1] = groups[Number(row.group) - 1] + 1;
            })
            .on('end', () => resolve(groups));
    });
};