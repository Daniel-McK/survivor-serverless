export interface Season {
  seasonId: string;
  name: string;
}

export interface Contestant {
  seasonId: string;
  name: string;
  id: string;
  imageUrl?: string;
  userId?: string;
  tribeName: string;
}

export interface Episode {
  seasonId: string;
  id: string;
  name: string;
  date: number;
}

export interface PointType {
  name: string;
  value: number;
}

export interface User {
  username: string;
  firstName: string;
  lastName: string;
}

export interface Point {
  seasonId: string;
  contestantPlusId: string;
  episodeId: string;
  pointType: PointType;
}
