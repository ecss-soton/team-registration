export type Tag = "rs" | "java" | "cpp" | "js" | "ts" | "kt" | "cs" | "rb" | "sql" | "py" | "c" | "dart" | "go" | "swift"

export interface Team {
  locked: boolean,
  members: Member[]
  id: string
}

export interface Member {
  name: string,
  discordTag?: string,
  yearOfStudy?: number
  tags: Tag[],
}

export interface RegisterForm {
  yearOfStudy: 1 | 2 | 3 | 4 | 5,
  knownLanguages: Tag[],
  dietaryReq?: string,
  extra?: string,
  photoConsent: boolean,
}