export interface TachiImport {
  meta: {
    game: string,
    playtype: string,
    service: string,
    version: string
  },
  scores: Score[]
}

export interface Score {
  matchType: string,
  identifier: string,
  difficulty: string,
  lamp: string,
  score: number,
  timeAchieved: number,
  judgements?: {
    MARVELOUS: number,
    PERFECT: number,
    GREAT: number,
    GOOD: number,
    OK: number,
    MISS: number,
  },
  optional?: {
    flare: string
  }
}
