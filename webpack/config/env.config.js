require("dotenv").config();

const resolve = require("path").resolve;
const GetEnv = require("getenv");

/*** disable error if env variable doesn't exists ***/
GetEnv.disableErrors();

const Env = GetEnv.multi({
	NODE_ENV: ["NODE_ENV", "development", "string"],
	SERVER_HOST: ["SERVER_HOST", "localhost", "string"],
	SERVER_PORT: ["SERVER_PORT", 3000, "int"],
	PUBLIC_PATH: ["PUBLIC_PATH", "/", "string"],
	HASHING: ["HASHING", false, "bool"],
	OPTIMISE: ["OPTIMISE", false, "bool"],
	CHUNKING: ["CHUNKING", false, "bool"],
	UGLIFY: ["UGLIFY", false, "bool"],
	COMPRESS: ["COMPRESS", false, "bool"],
	SCRIPT_CHUNKING: ["SCRIPT_CHUNKING", false, "bool"],
	SCRIPT_HASHING: ["SCRIPT_HASHINGG", false, "bool"],
	STYLE_CHUNKING: ["STYLE_CHUNKING", false, "bool"],
	STYLE_HASHING: ["STYLE_HASHING", false, "bool"],
	STYLE_OPTIMISE: ["STYLE_OPTIMISE", false, "bool"],
	IMAGE_HASHING: ["IMAGE_HASHING", false, "bool"],
	IMAGE_OPTIMISE: ["IMAGE_OPTIMISE", false, "bool"],
	
	MOCK: ["MOCK", true, "bool"],
	TRACKING: ["TRACKING", false, "bool"],
	NEW_RELIC_LICENCE: ["NEW_RELIC_LICENCE", "", "string"],
	NEW_RELIC_APPLICATION_ID: ["NEW_RELIC_APPLICATION_ID", "", "string"],
	MIXPANEL_PROJECT_ID: ["MIXPANEL_PROJECT_ID", "", "string"]
});

const Dir = {
	DIST: resolve(__dirname, "../../", "dist"),
	APP: resolve(__dirname, "../../", "app"),
	ROOT: resolve(__dirname, "../../"),
	MT_CORE: resolve(__dirname,"../../node_modules/mt-ui-core/app"),
	MINDTICKLE_COMMON: resolve(__dirname,"../../node_modules/@mindtickle/mt-ui-components/src")
};

module.exports = { Dir, Env };
