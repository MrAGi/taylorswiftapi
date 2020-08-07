# Taylor Swift API

API to interact with a database of Taylor swift songs.

## Current Status

The API is available on AWS API Gateway at the URL provided in email. Additionally, a Postman collection showing avaiable API endpoints and example responses was provided as well - this can be imported into Postman.

The API is unfinished by hopefully it shows various technologies that I am familiar with. I would have liked to spend time improving validation on the endpoints and also adding additional options for filtering results.

## Documentation

I have started to add JSDoc documentation comments to the javascript classes/functions but this could be improved and expanded. I would have also liked to look at adding the JSDoc Swagger integration to put inline Swagger documentation for the API. However, I have included the API endpoints and examples in a Postman collection as a fallback.

## Database Design

I spent a while considering how best to structure the data to enable a good range of queries. I considered SQL and NoSQL approaches. I settled on DynamoDB as I wanted to put the whole thing up on AWS and I have experience with this approach. However, in this situation because the range of queries was conceivably quite wide it might have been better to do this as an SQL database.

I did start looking at this approach but while I have designed and queried MySQL/Postgres/SQLite database directly in the past, my experience of AWS Aurora is limited. I didn't feel I would have had time to fully learn how to implement this into the cloud with an ORM etc. I did consider hosting the database elsewhere and and just querying via SQL directly but I really wanted to keep everything together for this task.

I also briefly considered a MongoDB database but I have limited experience of them at this stage.

I have tried to enable a range of queries with DynamoDB by making use of Global Secondary Indexes but I am aware there is a trade off there with additional costs.

## Testing

I have make use of Jest to test some aspects of the API. I realise there could be more tests added but I thought it would at least show that I was aware of the need for them.

## Next Steps

In addition to the additional options for filtering and improving validation I would have liked to write a terraform script to automatically manage the resource generation on AWS.