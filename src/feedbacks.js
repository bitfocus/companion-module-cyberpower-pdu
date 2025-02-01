const { combineRgb } = require('@companion-module/base')

module.exports = {
	// ##########################
	// #### Define Feedbacks ####
	// ##########################
	//s1Status: null,
	
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
					//self.log('info', 'Number:' + feedback.options.socketNum)
					//self.log('info', 'Status:' + self.s1Status)
					let socketNum = feedback.options.socketNum;
					let targetState = feedback.options.state;
					let currentStatus;
					
					switch (socketNum) {
                        case 1: currentStatus = self.DATA.s1Status; break;
                        case 2: currentStatus = self.DATA.s2Status; break;
                        case 3: currentStatus = self.DATA.s3Status; break;
                        case 4: currentStatus = self.DATA.s4Status; break;
                        case 5: currentStatus = self.DATA.s5Status; break;
                        case 6: currentStatus = self.DATA.s6Status; break;
                        case 7: currentStatus = self.DATA.s7Status; break;
                        case 8: currentStatus = self.DATA.s8Status; break;
                        default:
                            self.log('warn', 'Invalid socket number: ' + socketNum);
                            return false; // Or handle the error as needed
                    }
					
					
					let statusMatches = (currentStatus === 'On' && targetState === 'on') || (currentStatus === 'Off' && targetState === 'off');
					
					//let statusMatches = (self.DATA.s1Status === 'On' && targetState === 'on') || (self.DATA.s1Status === 'Off' && targetState === 'off');
					
					return statusMatches;
					//if (self.s1Status === '1' ) {
				//		return true
				//	} else {
				//		return false
				//	}
				},
			},			
		};


		this.setFeedbackDefinitions(feedbacks);
	}
	
}
