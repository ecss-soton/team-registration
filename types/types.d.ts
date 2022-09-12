export type Tag = "rs" | "java" | "cpp" | "js" | "ts" | "kt" | "cs" | "rb" | "sql" | "py" | "c"

export interface Member {
  name: string,
  discordTag?: string,
  tags: Tag[]
}

export interface Team {
  locked: boolean,
  members: Member[]
}

export interface RegisterForm {
  yearOfStudy: 1 | 2 | 3 | 4 | 5,
  knownLanguages: Tag[],
  dietaryReq?: string,
  extra?: string,
  photoConsent: boolean,
}