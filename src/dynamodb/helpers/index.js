export const generateWriterSortKey = (writer, song) => {
  return `${song}-w-${writer}`;
};

export const generatFeatureSortKey = (feature, song) => {
  return `${song}-f-${feature}`;
};

export const generatePlayCountSortKey = (count, year, month, song) => {
  return `${song}-p-${year}-${month}`;
};
