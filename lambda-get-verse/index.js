const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const csv = require('csv-parser');


exports.handler = async (event, context) => {
    const params = {
        Bucket: 'quran-reminder-dataset',
        Key: 'main_df.csv',
    };

    try {
        
        const s3Object = await s3.getObject(params).promise();
        const csvContent = s3Object.Body.toString('utf-8');

        const records = await parseCSV(csvContent);
        const randomLineObject = pickRandomRecord(records);

       
        return {
            statusCode: 200,
            body: JSON.stringify({ randomLineObject }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

  function parseCSV(csvContent) {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = require('stream');
        const csvStream = stream.Readable.from(csvContent);
        csvStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => reject(error));
    });
}

function pickRandomRecord(records) {
    const randomIndex = Math.floor(Math.random() * records.length);
    return records[randomIndex];
}
  