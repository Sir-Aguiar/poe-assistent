import "dotenv/config";
import { green, cyan, red, bgWhite } from "colors/safe";
import { getGemInfo, getHtml } from "./get-skillg-infos";
import { ISkillGem, TGemsColors } from "../../@types/skill-gem";
import { AxiosError } from "axios";

const GONE_WRONG = bgWhite("❌");
const GONE_RIGHT = green("✔");

type TSkillGemRepository = {
	gem_blue: ISkillGem[];
	gem_green: ISkillGem[];
	gem_red: ISkillGem[];
};

const SkillGemRepository: TSkillGemRepository = { gem_blue: [], gem_green: [], gem_red: [] };

const defineData = async () => {
	try {
		const PARSED_HTML = await getHtml(`${process.env.DB_BASEURL}/Active_Skill_Gems`);
		const gems = PARSED_HTML.querySelectorAll(".itemclass_gem");

		for (let index = 0; index < gems.length; index++) {
			let gem_string = "";
			const GEM = gems[index];
			const GEM_NAME = GEM.innerText;
			const GEM_TYPE = GEM.classList.value[1] as TGemsColors;

			try {
				const GEM_INFO = await getGemInfo(GEM_NAME);

				if (GEM_TYPE == "gem_blue") gem_string = `${cyan(GEM_NAME)} ${GONE_RIGHT}`;

				if (GEM_TYPE == "gem_green") gem_string = `${green(GEM_NAME)} ${GONE_RIGHT}`;

				if (GEM_TYPE == "gem_red") gem_string = `${red(GEM_NAME)} ${GONE_RIGHT}`;

				SkillGemRepository[GEM_TYPE].push(GEM_INFO);
			} catch (error) {
				if (GEM_TYPE == "gem_blue") gem_string = `${cyan(GEM_NAME)} ${GONE_WRONG}`;

				if (GEM_TYPE == "gem_green") gem_string = `${green(GEM_NAME)} ${GONE_WRONG}`;

				if (GEM_TYPE == "gem_red") gem_string = `${red(GEM_NAME)} ${GONE_WRONG}`;
			} finally {
				console.log(gem_string);
			}
		}
	} catch (e) {
		if (e instanceof AxiosError) {
			return console.log("Error in primary request");
		}
	}
};
