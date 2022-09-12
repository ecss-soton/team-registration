import {User} from "@prisma/client";

export type Tag = "rs" | "java" | "cpp" | "js" | "ts" | "kt" | "cs" | "rb" | "sql" | "py" | "c" | "dart" | "go" | "swift"

export interface Team {
  id: string
  locked: boolean,
  members: User[]
}

export interface RegisterForm {
  yearOfStudy: 1 | 2 | 3 | 4 | 5,
  knownLanguages: Tag[],
  dietaryReq?: string,
  extra?: string,
  photoConsent: boolean,
}