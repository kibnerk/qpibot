export type TNewsDataItem = {
  title: string;
  cover?: { thumbnailUrl?: string };
  url: string;
};

export interface NewsItem {
  type: 'entry';
  data: {
    id: number;
    title: string;
    audioUrl: string;
  };
}

export interface NewsDto {
  result: {
    items: NewsItem[];
  };
}
