module.exports = {
	// ##########################
	// #### Instance Actions ####
	// ##########################
	initActions: function () {
		var self = this;
		let actions = {};

		actions.switchOn = {
			name: 'Set Output Socket On',
			options: [
				{
					type: 'number',
					label: 'Socket',
					id: 'socketOn',
					min: 1,
					max: 24,
					default: 1,
					required: true,
				},
			],
			callback: async function(event) {
				let options = event.options;
				if (self.config.deviceType === 'ats') {
					self.sendATSOutletCommand('individual', options.socketOn, 1)
				} else {
					self.sendCommand('individual', options.socketOn, 1);
				}
			}
		};

		actions.switchOff = {
			name: 'Set Output Socket Off',
			options: [
				{
					type: 'number',
					label: 'Socket',
					id: 'socketOff',
					min: 1,
					max: 24,
					default: 1,
					required: true,
				},
			],
			callback: async function(event) {
				let options = event.options;
				if (self.config.deviceType === 'ats') {
					self.sendATSOutletCommand('individual', options.socketOff, 2)
				} else {
					self.sendCommand('individual', options.socketOff, 2);
				}
			}
		};
		
		actions.toggleSocket = {
			name: 'Toggle Output Socket',
			options: [
				{
					type: 'number',
					label: 'Socket',
					id: 'socketToggle',
					min: 1,
					max: 24,
					default: 1,
					required: true,
				},
			],
			callback: async function(event) {
				let options = event.options;
				if (self.config.deviceType === 'ats') {
					// toggle: read current state and invert (placeholder method)
					const statusKey = `atsOutlet${options.socketToggle}Status`
					const current = self.DATA[statusKey]
					const nextVal = current === 'On' ? 2 : 1
					self.sendATSOutletCommand('individual', options.socketToggle, nextVal)
				} else {
					self.sendCommand('toggle', options.socketToggle, 5); //5 is dummy
				}
			}
		};

		actions.allOn = {
			name: 'Set All Sockets On',
			options: [],
			callback: async function(event) {
				if (self.config.deviceType === 'ats') {
					self.sendATSOutletCommand('all', null, 1)
				} else {
					self.sendCommand('all', null, 2);
				}
			}
		};

		actions.allOff = {
			name: 'Set All Sockets Off',
			options: [],
			callback: async function(event) {
				if (self.config.deviceType === 'ats') {
					self.sendATSOutletCommand('all', null, 2)
				} else {
					self.sendCommand('all', null, 3);
				}
			}
		};

		// ATS actions (only active when deviceType === 'ats')
		actions.transferToSourceA = {
			name: 'ATS: Transfer to Source A',
			options: [],
			callback: async function() {
				if (self.config.deviceType === 'ats') self.sendATSCommand('sourceA')
			}
		}
		actions.transferToSourceB = {
			name: 'ATS: Transfer to Source B',
			options: [],
			callback: async function() {
				if (self.config.deviceType === 'ats') self.sendATSCommand('sourceB')
			}
		}

		//TEST - Get values "manually"
		/*
		actions.getValues = {
			name: 'Get Values',
			options: [],
			callback: async function(event) {
				self.getInfo(self.config.host, self.config.communityWrite);
				
			}
		};
		
	    actions.getStatus = {
			name: 'Get Status Values',
			options: [],
			callback: async function(event) {
				self.getStatus(self.config.host, self.config.communityWrite);
				
			}
		};
		
		//END TEST
        */

		this.setActionDefinitions(actions);
	}
}