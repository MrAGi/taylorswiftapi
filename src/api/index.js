import 'babel-polyfill';
import Debug from 'debug';
import ApiBuilder from 'claudia-api-builder';

import { DynamoDBHelper } from '../dynamodb';
import add from './add';

const debug = Debug('screencloud-api:api');

const api = new ApiBuilder();

add(api);

export default api;
