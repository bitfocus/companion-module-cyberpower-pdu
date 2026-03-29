const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets: function () {
		let self = this;
		let presets = [];
		const maxSockets = 18;

		const foregroundColor = combineRgb(255, 255, 255) // White
		const foregroundColorBlack = combineRgb(0, 0, 0) // Black
		const backgroundColorRed = combineRgb(255, 0, 0) // Red
		const backgroundColorWhite = combineRgb(255, 255, 255) // White

		for (let i = 1; i <= maxSockets; i++) {
			presets.push({
				type: 'button',
				category: 'Socket On',
				name: 'Switch Output ' + String(i) + ' On',
				style: {
					bgcolor: 0,
					text: String(i),
					size: '44',
					color: 16777215,
				},
				steps: [
					{
						// Put the 'latch' actions here
						down: [
							{
								actionId: 'switchOn',
								options: {
									socketOn: String(i),
								},
							}
						],
						up: [],
					},
				],
				feedbacks: []
			})
		}
	
		for (let i = 1; i <= maxSockets; i++) {
			presets.push({
				type: 'button',
				category: 'Socket Off',
				name: 'Switch Output ' + String(i) + ' Off',
				style: {
					bgcolor: 0,
					text: String(i),
					size: '44',
					color: 16777215,
				},
				steps: [
					{
						// Put the 'latch' actions here
						down: [
							{
								actionId: 'switchOff',
								options: {
									socketOff: String(i),
								},
							}
						],
						up: [],
					},
				],
				feedbacks: []
			})
		}
	
		for (let i = 1; i <= maxSockets; i++) {
			presets.push({
				type: 'button',
				category: 'Socket Latch On & Off',
				name: 'Toggle Output ' + String(i),
				style: {
					bgcolor: 0,
					text: String(i),
					size: '44',
					color: 16777215,
					latch: true,
				},
				steps: [
					{
						// Put the 'latch' actions here
						down: [
							{
								actionId: 'switchOn',
								options: {
									socketOn: String(i),
								},
							}
						],
						up: [],
					},
					{
						// Put the 'unlatch' actions here
						down: [
							{
								actionId: 'switchOff',
								options: {
									socketOff: String(i),
								},
							}
						],
						up: [],
					},
				],
				feedbacks: []
			})
		}
	
		this.setPresetDefinitions(presets);
	}
}
