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
				description: 'If the socket state has changed, change the style of the button',
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
				defaultStyle: {
					bgcolor: combineRgb(0, 255, 0),
					color: combineRgb(0, 0, 0)
				},
				callback: (feedback) => {
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
					return statusMatches;
				},
			},
			ATSActiveSource: {
				name: 'ATS Active Source',
				type: 'boolean',
				label: 'ATS Active Source',
				description: 'Highlight when specified source is active',
				options: [
					{
						id: 'source',
						type: 'dropdown',
						label: 'Source',
						choices: [
							{ id: 'A', label: 'Source A' },
							{ id: 'B', label: 'Source B' }
						],
						default: 'A'
					}
				],
				defaultStyle: {
					bgcolor: combineRgb(0, 0, 255),
					color: combineRgb(255, 255, 255)
				},
				callback: (fb) => {
					if (self.config.deviceType !== 'ats') return false
					let active = self.DATA.atsActiveSource
					if (!active) return false
					return (fb.options.source === 'A' && /A/i.test(active)) || (fb.options.source === 'B' && /B/i.test(active))
				}
			},
			ATSOutletState: {
				name: 'ATS Outlet State',
				type: 'boolean',
				label: 'ATS Outlet State',
				description: 'Change style when ATS outlet matches state',
				options: [
					{
						id: 'outletNum',
						type: 'number',
						label: 'Outlet Number',
						default: 1,
						min: 1,
						max: 8,
					},
					{
						id: 'state',
						type: 'dropdown',
						label: 'State',
						choices: [
							{ id: 'on', label: 'On' },
							{ id: 'off', label: 'Off' }
						],
						default: 'on'
					}
				],
				defaultStyle: {
					bgcolor: combineRgb(255, 200, 0),
					color: combineRgb(0, 0, 0)
				},
				callback: (fb) => {
					if (self.config.deviceType !== 'ats') return false
					const n = fb.options.outletNum
					const statusKey = `atsOutlet${n}Status`
					const current = self.DATA[statusKey]
					if (!current) return false
					return (current === 'On' && fb.options.state === 'on') || (current === 'Off' && fb.options.state === 'off')
				}
			}
		};

		this.setFeedbackDefinitions(feedbacks);
	}
}
