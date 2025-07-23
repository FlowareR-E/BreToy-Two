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

export interface AlbumDetails {
  album_type: 'album' | 'single' | 'compilation';
  artists: Artist[];
  available_markets: string[];
  copyrights: Copyright[];
  external_urls: ExternalUrls;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  total_tracks: number;
  tracks: {
    href: string;
    items: Track[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;

  };
  type: 'album';
  uri: string;
}

export interface Track {
  explicit: boolean;
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: Image[];
  };
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
  popularity: number;
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
export interface Copyright {
  text: string;
  type: string;
}
