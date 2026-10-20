export interface UnsplashPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  width: number;
  height: number;
  color: string | null;
  urls: { raw: string; full: string; regular: string; small: string; thumb: string };
  links: { html: string; download_location: string };
  user: { name: string; username: string; links: { html: string } };
}
export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}
