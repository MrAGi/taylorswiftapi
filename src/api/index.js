import 'babel-polyfill';
import Debug from 'debug';
import ApiBuilder from 'claudia-api-builder';

import { DynamoDBHelper } from '../dynamodb';
import add from './add';
import playcount from './playcount';

const debug = Debug('screencloud-api:api');

const api = new ApiBuilder();

add(api);
playcount(api);

export default api;
