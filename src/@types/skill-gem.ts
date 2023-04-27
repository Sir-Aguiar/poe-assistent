interface ISkillGem {
	name: string;
	description: string;
	requirement: string;
	modifiers: string[];
	properties: string[];
	images: {
		skill_icon: string;
		gem_icon: string;
	};
	isCorrupted: boolean;
}

type TGemsColors = "gem_green" | "gem_red" | "gem_blue";

export { ISkillGem, TGemsColors };
