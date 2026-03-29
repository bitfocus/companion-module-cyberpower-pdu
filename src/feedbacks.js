const { combineRgb } = require('@companion-module/base')

module.exports = {
	// ##########################
	// #### Define Feedbacks ####
	// ##########################
	
	initFeedbacks: function () {
		let self = this;
		const maxSockets = 18;
		let feedbacks = {
			SocketState: {
				name: 'Socket State',
				type: 'boolean',
				label: 'Socket State',
				description: 'If the socket state has changed, change the style of the button',
				options: [
					{
						id: 'socketNum',
						type: 'number',
						label: 'Socket Number',
						default: 1,
						min: 1,
						max: maxSockets,
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
				defaultStyle: {
					bgcolor: combineRgb(0, 255, 0),
					color: combineRgb(0, 0, 0)
				},
				callback: (feedback) => {
					let socketNum = feedback.options.socketNum;
					let targetState = feedback.options.state;
					if (socketNum < 1 || socketNum > maxSockets) {
						self.log('warn', 'Invalid socket number: ' + socketNum);
						return false;
					}
					let currentStatus = self.DATA[`s${socketNum}Status`];
					let statusMatches = (currentStatus === 'On' && targetState === 'on') || (currentStatus === 'Off' && targetState === 'off');					
					return statusMatches;
				},
			},			
		};

		this.setFeedbackDefinitions(feedbacks);
	}
}
