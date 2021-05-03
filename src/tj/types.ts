export interface NewsItem {
  title: string;
  cover?: { thumbnailUrl?: string };
  url: string;
}

export interface NewsDto {
  result: NewsItem[];
}
