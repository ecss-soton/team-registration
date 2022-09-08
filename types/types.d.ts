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