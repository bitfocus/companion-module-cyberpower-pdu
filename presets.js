exports.getPresets = function (instanceLabel) {
	var presets = []
	var i

	for (i = 1; i < 9; i++) {
		presets.push({
			category: 'Socket On',
			label: 'Switch Output ' + String(i) + ' On',
			bank: {
				bgcolor: 0,
				style: 'text',
				text: String(i),
				size: '44',
				color: 16777215,
			},
			actions: [
				{
					action: 'switchOn',
					options: {
						socketOn: String(i),
					},
				},
			],
		})
	}

	for (i = 1; i < 9; i++) {
		presets.push({
			category: 'Socket Off',
			label: 'Switch Output ' + String(i) + ' Off',
			bank: {
				bgcolor: 0,
				style: 'text',
				text: String(i),
				size: '44',
				color: 16777215,
			},
			actions: [
				{
					action: 'switchOff',
					options: {
						socketOff: String(i),
					},
				},
			],
		})
	}

	for (i = 1; i < 9; i++) {
		presets.push({
			category: 'Socket Latch On & Off',
			label: 'Toggle Output ' + String(i),
			bank: {
				bgcolor: 0,
				style: 'text',
				text: String(i),
				size: '44',
				color: 16777215,
				latch: true,
			},
			actions: [
				{
					action: 'switchOn',
					options: {
						socketOn: String(i),
					},
				},
			],
			release_actions: [
				{
					action: 'switchOff',
					options: {
						socketOff: String(i),
					},
				},
			],
		})
	}

	return presets
}
