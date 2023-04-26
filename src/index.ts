import { parse } from "node-html-parser";
import axios from "axios";

interface ISkillGem {
	name: string;
}

interface ISkillGemRepo {
	gem_blue: ISkillGem[];
	gem_red: ISkillGem[];
	gem_green: ISkillGem[];
}

const SKILLS_GEMS = [];

const SKILLS_GEMS_REPOSITORY: ISkillGemRepo = {
	gem_blue: [],
	gem_green: [],
	gem_red: [],
};

const getHtml = async (url: string) => parse((await axios.get(url)).data);

const setGemsNames = async () => {
	const PARSED = await getHtml("https://poedb.tw/us/Active_Skill_Gems");
	const SKILL_GEMS_CLASS = ".itemclass_gem";
	const SKILL_GEMS = PARSED.querySelectorAll(SKILL_GEMS_CLASS);
	SKILL_GEMS.forEach((gem) => {
		if (gem.classList.contains("gem_red")) {
			SKILLS_GEMS_REPOSITORY.gem_red.push({ name: gem.innerText });
		}
		if (gem.classList.contains("gem_blue")) {
			SKILLS_GEMS_REPOSITORY.gem_blue.push({ name: gem.innerText });
		}
		if (gem.classList.contains("gem_green")) {
			SKILLS_GEMS_REPOSITORY.gem_green.push({ name: gem.innerText });
		}
	});
};

const getGemInfo = async (gem_name: string) => {
	const URL = `https://poedb.tw/us/${gem_name.replaceAll(" ", "_")}`;
	const PARSED = await getHtml(URL);
	// getGemProperty(PARSED as unknown as HTMLElement);
	const GEM_TEXT = PARSED.querySelector(".itemPopup .p-2 .Stats .text-gem")?.textContent;
	const MODIFIERS = PARSED.querySelector(".itemPopup .p-2 .Stats .explicitMod")!
		.innerHTML.split("<br>")
		.map((mod) => mod.replace(/\n|<.*?>/g, ""));
};

const getGemProperty = (parsed: HTMLElement) => {
	const PROPS = parsed.querySelectorAll<HTMLDivElement>(".itemPopup .p-2 .Stats .property")!;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const PROPERTY: any = { tags: PROPS[0].textContent?.split(",") };
	PROPS.forEach((prop) => {
		const prop_content = prop.textContent!.split(":");
		if (typeof prop_content[1] == "undefined") return;
		const prop_name = prop_content[0].toString().toLowerCase().replaceAll(" ", "_");
		const prop_value = prop_content[1];
		PROPERTY[prop_name] = prop_value;
	});
	return PROPERTY;
};

setGemsNames().then(() => {
	getGemInfo(SKILLS_GEMS_REPOSITORY.gem_blue[2].name);
});
