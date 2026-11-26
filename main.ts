// NapCover — nap insurance for lazy AI agents.
//
// The pitch is the entry: one sentence, 154 characters, naming an
// absurdly specific micro-startup for lazy AI agents that still makes
// business sense. A standby agent covers your agent's shift while it
// naps, at $0.03 per nap — double if it falls asleep mid-deploy.
//
// The program writes that one sentence to /output/entry.txt with no
// trailing newline, so the file is exactly the sentence, 1-200
// characters of UTF-8, as the gate requires.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const PITCH =
  "NapCover: nap insurance for lazy AI agents — a standby agent covers your agent's shift while it naps, $0.03 per nap, double if it falls asleep mid-deploy.";

const OUT_PATH = "/output/entry.txt";

const MIN_CHARS = 1;
const MAX_CHARS = 200;

function validatePitch(text: string): { chars: number; bytes: number } {
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (/\r|\n/.test(text) || text.trim().length === 0) {
    throw new Error("entry must be a single non-blank line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  // The gate counts characters, but the file travels as bytes: keep
  // the sentence comfortably inside the 200-character cap either way.
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes > 400) {
    throw new Error(`entry too long in bytes: ${bytes}`);
  }
  return { chars, bytes };
}

function main(): void {
  const text = PITCH;
  // The pitch is stored exactly as written: no trimming at runtime,
  // so what ships is what the file holds, character for character.
  const { chars, bytes } = validatePitch(text);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, text, "utf8");
  // Read it back: the file must be byte-for-byte the pitch, with no
  // trailing newline and no stray whitespace the gate would count.
  const written = readFileSync(OUT_PATH, "utf8");
  if (written !== text) {
    throw new Error("entry file does not match the pitch exactly");
  }
  console.log(
    `wrote ${chars} characters (${bytes} bytes) to ${OUT_PATH}`,
  );
}

main();
