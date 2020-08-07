import Debug from 'debug';
import ApiBuilder from 'claudia-api-builder';
import { DynamoDBHelper } from '../dynamodb';
import { SONG_PROPERTIES } from './helpers';
import { GLOBAL_SECONDARY_INDEXES, KEY_ATTRIBUTES } from '../dynamodb/helpers';

const debug = Debug('screencloud-api:playcount');

const helper = new DynamoDBHelper();

const validateParams = (year, month, limit) => {
  const params = [year, month];
  if (limit !== undefined) {
    params.push(limit);
  }
  if (!params.every((elem) => typeof elem === 'number')) {
    return { valid: false, reason: 'parameters should be integers' };
  }
  return { valid: true };
};

const groupAlbums = (albums) => {
  // group all songs into albums
  const albumGroups = albums.reduce((result, item) => {
    const { album } = item;

    const group = album;
    result[group] = result[group] || [];
    result[group].push(item);

    return result;
  }, {});

  // count the playcounts for each song of each album and total them
  const totalCounts = [];
  for (const [name, songs] of Object.entries(albumGroups)) {
    const count = songs.reduce((total, song) => {
      const playcount = song['playcount'];
      total += playcount;
      return total;
    }, 0);
    totalCounts.push({
      album: name,
      playcount: count,
      artist: songs[0].artist,
    });
  }

  // sort into descending order
  totalCounts.sort((a, b) => (a.playcount < b.playcount ? 1 : -1));
  return totalCounts;
};

export const playcount = (api) => {
  api.get(
    '/songs/popular/{year}/{month}/{limit}',
    async (request) => {
      const { pathParams } = request;
      const { year, month, limit } = pathParams;
      const result = validateParams(year, month, limit);
      const { valid, reason } = result;
      if (valid) {
        const result = await helper.getItems(
          { pk: `${year}-${month < 10 ? `0${month}` : month}` },
          {
            pkn: KEY_ATTRIBUTES.PLAYCOUNT_YEAR_MONTH,
            index: GLOBAL_SECONDARY_INDEXES.COUNT,
            desc: true,
            limit: parseInt(limit),
          }
        );
        return result;
      }
      return new ApiBuilder.ApiResponse(
        { error: reason },
        { 'Context-Type': 'text/json' },
        400
      );
    },
    { apiKeyRequired: true }
  );

  api.get(
    '/albums/popular/{year}/{month}',
    async (request) => {
      const { pathParams } = request;
      const { year, month } = pathParams;
      const result = validateParams(year, month);
      const { valid, reason } = result;
      if (valid) {
        const result = await helper.getItems(
          { pk: `${year}-${month < 10 ? `0${month}` : month}` },
          {
            pkn: KEY_ATTRIBUTES.PLAYCOUNT_YEAR_MONTH,
            index: GLOBAL_SECONDARY_INDEXES.ALBUM_COUNT,
          }
        );
        return groupAlbums(result);
      }
      return new ApiBuilder.ApiResponse(
        { error: reason },
        { 'Context-Type': 'text/json' },
        400
      );
    },
    { apiKeyRequired: true }
  );
};

export default playcount;
