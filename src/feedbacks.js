const { combineRgb } = require('@companion-module/base')

module.exports = {
	// ##########################
	// #### Define Feedbacks ####
	// ##########################
	initFeedbacks: function () {
		let self = this;
		let feedbacks = {
			SocketState: {
				name: 'Socket State',
				type: 'boolean',
				label: 'Socket State',
				defaultStyle: {
					bgcolor: combineRgb(255, 0, 0),
					color: combineRgb(0, 0, 0),
				},
				options: [
					{
						id: 'socketNum',
						type: 'number',
						label: 'Socket Number',
						default: 1,
						min: 1,
						max: 8,
						description: 'Socket to monitor',
					},
					{
						id: 'state',
						type: 'dropdown',
						label: 'State',
						choices: [
							{id: 'on', label: 'On' ,descripion: 'Trigger when socket is on'},
							{id: 'off', label: 'Off',descripion: 'Trigger when socket is off' }
						],
						default: 'on',
						description: 'State to trigger feedback',
					},
				],
				callback: (feedback) => {
					self.log('info', 'Number:' + feedback.options.socketNum)
					self.log('info', 'Status:' + self.s1Status)
					if (self.s1Status === '1' ) {
						return true
					} else {
						return false
					}
				},
			},			
		};

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red
		const backgroundColorGreen = combineRgb(0, 255, 0) // Green
		const backgroundColorOrange = combineRgb(255, 102, 0) // Orange

		this.setFeedbackDefinitions(feedbacks);
	}
	
}
