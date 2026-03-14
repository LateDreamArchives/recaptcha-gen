import type { UserConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue';

import { version as vueVer } from 'vue';

const getPackageVersion = (name: string) => {
	const packageJsonPath = path.resolve(__dirname, `node_modules/${name}/package.json`);
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
	return packageJson.version;
}

// https://vitejs.dev/config/

export default <UserConfig>{
	plugins: [vue()],
	base: './',
	define: {
		__APP_NAME__: JSON.stringify(process.env.npm_package_name),
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
		__APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
		__APP_IS_PRE_BUILD__: JSON.stringify(process.env.npm_package_version!.includes('pre')),
		pico_css: JSON.stringify(getPackageVersion('@picocss/pico')),
		modern_screenshot: JSON.stringify(getPackageVersion('modern-screenshot')),
		vue: JSON.stringify(vueVer),
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@app': path.resolve(__dirname, 'src/app'),
			'@libs': path.resolve(__dirname, 'src/libs'),
		}
	},
	build: {
		modulePreload: {
			polyfill: true
		},
		rolldownOptions: {
			// output: {
			// 	manualChunks: {
			// 		'libs/vue': ['vue'],
			// 		'libs/modern-screenshot': ['modern-screenshot'],
			// 		'libs/file-helper': ['@libs/file-helper'],
			// 		'libs/system-checker': ['@libs/browser.min'],
			// 		'libs/shared-api': ['@libs/shared-api'],
			// 	}
			// }
			output: {
				codeSplitting: {
					groups: [
						{ name: 'libs/vue', test: /node_modules\/vue/ },
						{ name: 'libs/modern-screenshot', test: /node_modules\/modern-screenshot/ },
						{ name: 'libs/file-helper', test: /node_modules\/@libs\/file-helper/ },
						{ name: 'libs/system-checker', test: /node_modules\/@libs\/browser.min/ },
						{ name: 'libs/shared-api', test: /node_modules\/@libs\/shared-api/ },
					]
				}
			}
		}
	}
};