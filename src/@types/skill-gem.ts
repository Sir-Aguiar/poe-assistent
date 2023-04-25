
interface ISkillGem {
	class: "Active Skill Gem" | "Support Skill Gem" | "Vaal Skill Gem";
	name: string;
	description: string;
	vendor_offer: string;
	vendor_price: string;
	effects: string[];
	
}

export { ISkillGem };
