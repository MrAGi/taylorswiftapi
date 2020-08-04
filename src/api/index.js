import 'babel-polyfill';
import Debug from 'debug';
import ApiBuilder from 'claudia-api-builder';

import { DynamoDBHelper } from '../dynamodb';

const debug = Debug('somfy:api');

const api = new ApiBuilder();
const dynamoDB = new DynamoDBHelper();

export default api;
