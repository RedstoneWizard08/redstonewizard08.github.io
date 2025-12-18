import skillsJson from "./skills.json" with { type: "json" };
import statesJson from "./states.json" with { type: "json" };
import type { SkillIndex, StateIndex } from "./types.ts";

export const skills: SkillIndex = skillsJson as SkillIndex;
export const states: StateIndex = statesJson as StateIndex;
