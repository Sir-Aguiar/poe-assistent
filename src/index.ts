import { parse } from "node-html-parser";
import axios from "axios";
import { ISkillGem } from "./@types/skill-gem";
import { writeFile } from "fs";
import path from "path";

const SKILLS_GEMS: {
	gem_red: ISkillGem[];
	gem_blue: ISkillGem[];
	gem_green: ISkillGem[];
} = {
	gem_red: [],
	gem_blue: [],
	gem_green: [],
};

const getHtml = async (url: string) => parse((await axios.get(url)).data);

const getGemImages = (parsed: HTMLElement) => {
	try {
		const skill_icon = parsed.querySelector(".itemboximage .skilllIcon")!.getAttribute("src")!;
		const gem_icon = parsed.querySelector(".itemboximage img")!.getAttribute("src")!;
		return { skill_icon, gem_icon };
	} catch (error) {
		throw new Error(`An error has happened at gettin the images`);
	}
};

const getGemProperties = (parsed: HTMLElement) => {
	try {
		const PROPS = parsed.querySelectorAll<HTMLDivElement>(".itemPopup .p-2 .Stats .property")!;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const PROPERTIES: any = { tags: PROPS[0].textContent?.split(",") };

		PROPS.forEach((prop) => {
			const prop_content = prop.textContent!.split(":");
			if (typeof prop_content[1] == "undefined") return;
			const prop_name = prop_content[0].toString().toLowerCase().replaceAll(" ", "_");
			const prop_value = prop_content[1];
			PROPERTIES[prop_name] = prop_value;
		});
		return PROPERTIES;
	} catch (e) {
		throw new Error("An error has happened at getting the properties");
	}
};

const getGemModifiers = (parsed: HTMLElement) => {
	try {
		const modifiers = parsed.querySelector(".itemPopup .p-2 .Stats .explicitMod")!;
		return modifiers.innerHTML.split("<br>").map((mod) => mod.replace(/\n|<.*?>/g, "").replaceAll("&ndash;", "-"));
	} catch (e) {
		throw new Error("An error has happened trying to get the modifiers");
	}
};

const getGemDescription = (parsed: HTMLElement) => {
	try {
		return parsed.querySelector(".itemPopup .p-2 .Stats .text-gem")!.textContent!;
	} catch (error) {
		throw new Error("An error has happened trying to get the gem description");
	}
};

const getGemRequirements = (parsed: HTMLElement) => {
	try {
		return parsed.querySelector(".itemPopup .p-2 .Stats .requirements")!.textContent!;
	} catch (error) {
		throw new Error("An error has happened trying to get the gem requirements");
	}
};
const getGemInfo = async (gem_name: string): Promise<ISkillGem> => {
	const URL = `https://poedb.tw/us/${gem_name.replaceAll(" ", "_")}`;
	const PARSED = (await getHtml(URL)) as unknown as HTMLElement;
	const images = getGemImages(PARSED);
	const properties = getGemProperties(PARSED);
	const modifiers = getGemModifiers(PARSED);
	const gem_text = getGemDescription(PARSED);
	const requirement = getGemRequirements(PARSED);
	const isCorrupted = PARSED.querySelector(".corrupted") ? true : false;
	return {
		images,
		modifiers,
		name: gem_name,
		properties,
		requirement,
		description: gem_text,
		isCorrupted,
	};
};


/* writeFile(path.resolve(__dirname, "public", "gems.json"), JSON.stringify(SKILLS_GEMS), "utf8", function (err) {
	if (err) {
		console.log("An error occured while writing JSON Object to File.");
		return console.log(err);
	}

	console.log("JSON file has been saved.");
}); */
