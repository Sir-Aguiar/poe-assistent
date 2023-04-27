import { ISkillGem } from "../../@types/skill-gem";
import "dotenv/config";
import { getGemDescription, getGemImages, getGemModifiers, getGemProperties, getGemRequirements } from "./attributes";
import { parse } from "node-html-parser";
import axios from "axios";

const getHtml = async (url: string) => parse((await axios.get(url)).data);

const getGemInfo = async (gem_name: string): Promise<ISkillGem> => {
	const URL = `${process.env.DB_BASE_URL}/${gem_name.replaceAll(" ", "_")}`;
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

export { getGemInfo, getHtml };
