<script setup lang="ts">
import {useTemplateRef, ref} from 'vue';
import {file2base64} from '@libs/shared-api';

// const picNum = ref<number>(9);
// const picIndex = ref<number>(4);
const picNum2 = {
	x: ref<number>(3),
	y: ref<number>(3)
}
const mainRef = useTemplateRef<HTMLDivElement>('main');
const showTip = ref<boolean>(true);
const showCtrls = ref<boolean>(true);
const singlePicMode = ref<boolean>(false);
const singlePicFillMode = ref<PicFillMode>('fill');

const lowZoomMode = (value: boolean) => {
	mainRef.value!.classList.toggle('low-zoom-mode', value);
}

const setImg = (target: HTMLImageElement) => {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/*';
	input.click();
	input.addEventListener('change', async() => {
		const files = input.files;
		if(!!files && files.length > 0)
			target.src = await file2base64(files![0]);
		input.remove();
	});
}

// const setPicNum = (num: number) => picNum.value = num;

defineExpose({
	mainNode: mainRef,
	lowZoomMode: (value: boolean) => lowZoomMode(value),
	showTip: (value: boolean) => showTip.value = value,
	showCtrls: (value: boolean) => showCtrls.value = value,
	// setPicNum,
	setPicNum2: (num: {x: number, y: number}) => {
		picNum2.x.value = num.x;
		picNum2.y.value = num.y;
		console.log('setPicNum2:', num, picNum2.x.value, picNum2.y.value);
	},
	getPicNum2: () => ({
		x: picNum2.x.value,
		y: picNum2.y.value,
	}),
	switchSinglePicMode: (value: boolean) => singlePicMode.value = value,
	getSinglePicMode: () => singlePicMode.value,
	setSinglePicFillMode: (value: PicFillMode) => singlePicFillMode.value = value,
	getSinglePicFillMode: () => singlePicFillMode.value,
	// singlePicMode,
	// singlePicFillMode,
});
</script>

<template>
	<div class="low-zoom-mode" ref="main" :style="singlePicMode && {'min-width': '400px', 'min-height': '580px'}">
		<div id="rc-imageselect" aria-modal="true" role="dialog">
			<div class="rc-imageselect-response-field"></div><span class="rc-imageselect-tabloop-begin"
				tabindex="0"></span>
			<div class="rc-imageselect-payload">
				<div class="rc-imageselect-instructions">
					<div class="rc-imageselect-desc-wrapper">
						<div class="rc-imageselect-desc-no-canonical" style="width: 352px; font-size: 12px; margin-top: -8px;">
							<span contenteditable>请选择包含</span>
							<span contenteditable style="font-size: 28px; font-weight: bold;">晚梦</span>
							<span contenteditable>的所有图{{ singlePicMode? '块': '片' }}。</span>
							<span contenteditable v-if="showTip" style="font-size: 14px;" v-text="singlePicMode? '': '在没有新图片可以点按后，请点击“验证”。'"></span>
						</div>
					</div>
					<div class="rc-imageselect-progress"></div>
				</div>
				<div class="rc-imageselect-challenge">
					<div id="rc-imageselect-target" class="rc-imageselect-target" dir="ltr" role="presentation"
						aria-hidden="true">
						<table class="rc-imageselect-table-33">
							<tbody v-if="singlePicMode">
								<img @click="setImg(($event.target as HTMLImageElement))"
									 src="https://assets.latedream.qzz.io/avatars/latedream/current.webp"
									 id="single-pic" :style="{objectFit: singlePicFillMode}" />
								<tr v-for="index in picNum2.y.value" :key="index" style="pointer-events: none;">
									<td v-for="index in picNum2.x.value" :key="index" role="button" class="rc-imageselect-tile" aria-label="图片验证"
										style="width: 126px; height: 126px; position: relative;">
										<div style="width: 100%; height: 100%; position: absolute; left: 0; top: 0; z-index: 1; background-color: transparent; border: 1px solid white;"></div>
									</td>
								</tr>
							</tbody>
							<tbody v-else>
								<tr v-for="index in picNum2.y.value" :key="index">
									<td v-for="index in picNum2.x.value" :key="index" role="button" class="rc-imageselect-tile" aria-label="图片验证">
										<div class="rc-image-tile-target">
											<div class="rc-image-tile-wrapper" style="width: 126px; height: 126px">
												<img @click="setImg(($event.target as HTMLImageElement))" class="rc-image-tile-33"
													src="https://assets.latedream.qzz.io/avatars/latedream/current.webp"
													alt="" style="top:0%;">
												<div class="rc-image-tile-overlay"></div>
											</div>
											<div class="rc-imageselect-checkbox"></div>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="rc-footer">
				<div class="rc-separator"></div>
				<div class="rc-controls">
					<div class="primary-controls">
						<div v-if="showCtrls" class="rc-buttons">
							<div class="button-holder reload-button-holder"><button
									class="rc-button goog-inline-block rc-button-reload" title="换一个新的验证码" value=""
									id="recaptcha-reload-button" tabindex="3"></button></div>
							<div class="button-holder audio-button-holder"><button
									class="rc-button goog-inline-block rc-button-audio" title="改用音频验证" value=""
									id="recaptcha-audio-button" tabindex="1"></button></div>
							<div class="button-holder liveness-button-holder" style="display: none;"></div>
							<div class="button-holder help-button-holder"><button
									class="rc-button goog-inline-block rc-button-help" title="帮助" value=""
									id="recaptcha-help-button" tabindex="2"></button></div>
							<div class="button-holder undo-button-holder"><button
									class="rc-button goog-inline-block rc-button-undo" title="撤消" value=""
									id="recaptcha-undo-button" tabindex="0" style="display: none;"></button></div>
						</div>
						<div class="verify-button-holder"><button class="rc-button-default goog-inline-block"
								title="" value="" id="recaptcha-verify-button" tabindex="0"><span contenteditable>验证</span></button></div>
					</div>
					<div class="rc-challenge-help" style="display:none" tabindex="0"></div>
				</div>
			</div><span class="rc-imageselect-tabloop-end" tabindex="0"></span>
		</div>
	</div>
</template>

<style scoped>
@import url('@/recapcha-css/styles__ltr.css');
* {
	/** prevent picocss override */
	--pico-font-family: initial;
	line-height: initial;
	box-sizing: initial;
}
.low-zoom-mode .rc-image-tile-33 {
	width: 100%;
	height: 100%;
}
#single-pic {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	z-index: 0;
}
</style>