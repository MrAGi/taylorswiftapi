module.exports = {
  tables: [
    {
      TableName: 'music',
      AttributeDefinitions: [
        { AttributeName: 'artist', AttributeType: 'S' },
        { AttributeName: 'song', AttributeType: 'S' },
        { AttributeName: 'album', AttributeType: 'S' },
        { AttributeName: 'year', AttributeType: 'S' },
        { AttributeName: 'cover', AttributeType: 'N' },
        { AttributeName: 'albumversion', AttributeType: 'N' },
        { AttributeName: 'singleversion', AttributeType: 'N' },
        { AttributeName: 'remix', AttributeType: 'N' },
        { AttributeName: 'liveversion', AttributeType: 'N' },
        { AttributeName: 'piano', AttributeType: 'N' },
        { AttributeName: 'writer', AttributeType: 'S' },
        { AttributeName: 'featuring', AttributeType: 'S' },
        { AttributeName: 'playcountyear', AttributeType: 'S' },
        { AttributeName: 'playcountmonth', AttributeType: 'S' },
      ],
      KeySchema: [
        {
          AttributeName: 'artist',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'song',
          KeyType: 'RANGE',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'year-index',
          KeySchema: [
            {
              AttributeName: 'year',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'featuring-song-index',
          KeySchema: [
            {
              AttributeName: 'featuring',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'song',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'singleversion-index',
          KeySchema: [
            {
              AttributeName: 'singleversion',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'liveversion-index',
          KeySchema: [
            {
              AttributeName: 'liveversion',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'cover-index',
          KeySchema: [
            {
              AttributeName: 'cover',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'albumversion-index',
          KeySchema: [
            {
              AttributeName: 'albumversion',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'piano-index',
          KeySchema: [
            {
              AttributeName: 'piano',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'remix-index',
          KeySchema: [
            {
              AttributeName: 'remix',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'album-index',
          KeySchema: [
            {
              AttributeName: 'album',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'writer-song-index',
          KeySchema: [
            {
              AttributeName: 'writer',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'song',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'playcount-index',
          KeySchema: [
            {
              AttributeName: 'playcountyear',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'playcountmonth',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            NonKeyAttributes: ['playcount'],
            ProjectionType: 'INCLUDE',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
  ],
  port: 8000,
};
