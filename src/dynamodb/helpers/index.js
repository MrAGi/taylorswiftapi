export const generateWriterSortKey = (writer, song) => {
  return `${song}-w-${writer}`;
};

export const generatFeatureSortKey = (feature, song) => {
  return `${song}-f-${feature}`;
};

export const generatePlayCountSortKey = (count, year, month, song) => {
  return `${song}-p-${year}-${month}`;
};

export const GLOBAL_SECONDARY_INDEXES = {
  YEAR: 'year-index',
  FEATURING: 'featuing-song-index',
  SINGLE_VERSION: 'singleversion-index',
  LIVE_VERSION: 'liveversion-index',
  COVER_VERSION: 'cover-index',
  ALBUM_VERSION: 'albumversion-index',
  PIANO_VERSION: 'piano-index',
  REMIX_VERSION: 'remix-index',
  ALBUM: 'album-index',
  WRITER: 'writer-song-index',
  COUNT: 'count-index',
  ALBUM_COUNT: 'album-count-index',
};

export const KEY_ATTRIBUTES = {
  ARTIST: 'artist',
  SONG: 'song',
  ALBUM: 'album',
  YEAR: 'year',
  COVER: 'cover',
  ALBUM_VERSION: 'album_version',
  SINGLE_VERSION: 'single_version',
  REMIX: 'remix',
  LIVE_VERSION: 'liveversion',
  PIANO: 'piano',
  WRITER: 'writer',
  FEATURING: 'featuring',
  PLAYCOUNT_YEAR_MONTH: 'playcountyearmonth',
  PLAYCOUNT: 'playcount',
};
