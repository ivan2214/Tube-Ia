export interface ResponseVideoDetailsFastApi {
  id: string;
  title: string;
  lengthSeconds: string;
  keywords: string[];
  channelTitle: string;
  channelId: string;
  description: string;
  thumbnail: Thumbnail[];
  allowRatings: boolean;
  viewCount: string;
  isPrivate: boolean;
  isUnpluggedCorpus: boolean;
  isLiveContent: boolean;
  isCrawlable: boolean;
  isFamilySafe: boolean;
  availableCountries: string[];
  isUnlisted: boolean;
  category: string;
  publishDate: string;
  uploadDate: string;
  subtitles: Subtitles;
  storyboards: Storyboard[];
  superTitle: null;
  likeCount: string;
  channelThumbnail: Thumbnail[];
  channelBadges: string[];
  subscriberCountText: string;
  subscriberCount: number;
  commentCountText: string;
  commentCount: number;
  relatedVideos: RelatedVideos;
}

interface RelatedVideos {
  continuation: string;
  data: Datum[];
}

interface Datum {
  type: string;
  videoId: string;
  title: string;
  lengthText: string;
  viewCount: string;
  publishedTimeText: string;
  thumbnail: Thumbnail[];
  channelTitle: string;
  channelId: string;
  channelThumbnail: Thumbnail[];
}

interface Storyboard {
  width: string;
  height: string;
  thumbsCount: string;
  columns: string;
  rows: string;
  interval: string;
  storyboardCount: number;
  url: string[];
}

interface Subtitles {
  subtitles: Subtitle[];
  format: string;
  translationLanguages: TranslationLanguage[];
}

interface TranslationLanguage {
  languageCode: string;
  languageName: string;
}

interface Subtitle {
  languageName: string;
  languageCode: string;
  isTranslatable: boolean;
  url: string;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}
