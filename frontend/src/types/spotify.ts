export interface Artist {
  id: string;
  name: string;
  genre: string;
  imageUrl: string;
  popularity: number;
}

export interface ArtistDetails {
  id: string;
  name: string;
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  images: Image[];
  popularity: number;
  type: string;
  uri: string;
}
export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

export interface Followers {
  href: string | null;
  total: number;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  images: Image[];
  release_date: string;
}

export interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: Image[];
  };
  duration_ms: number;
}

export interface SearchResult {
  albums?: {
    items: Album[];
  }
  artists?: {
    items: ArtistDetails[];
  }
  tracks?: {
    items: Track[];
  }
}