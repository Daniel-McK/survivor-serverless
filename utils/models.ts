export interface Season {
  seasonId: string;
  name: string;
}

export interface Contestant {
  seasonId: string;
  name: string;
  id: string;
  imageUrl?: string;
}