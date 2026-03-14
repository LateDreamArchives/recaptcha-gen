import { ref, readonly } from 'vue';
import browser from '@libs/browser.min';

const debug = ref(import.meta.env.DEV);
const info = await browser.getInfo();
// @ts-ignore
const brands = navigator.userAgentData?.brands.filter((brand) => !/not.?a.?brand/.test(brand.brand.toLowerCase()));

const debugInfo = {
	name: __APP_NAME__,
	version: __APP_VERSION__,
	env: import.meta.env.MODE,
	debug: readonly(debug),
	buildTime: __APP_BUILD_TIME__,
	isPreBuild: __APP_IS_PRE_BUILD__,
	picoCss: pico_css,
	modernScreenshot: modern_screenshot,
	vue: vue,
	device: {
		type: info.device,
		os: `${info.system} ${info.systemVersion}`,
		platform: info.platform,
		arch: info.architecture,
		bit: info.bitness,
	},
	browser: {
		name: brands[0].brand,
		version: brands[0].version,
	}
};
Object.defineProperty(debugInfo, 'debug', {
	get: () => debug.value,
});
Object.freeze(debugInfo);

export const activeDebug = () => debug.value = true;
export default {
	debugInfo,
}