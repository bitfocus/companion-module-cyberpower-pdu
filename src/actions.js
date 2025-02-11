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
				self.sendCommand('individual', options.socketOn, 1);
				// getStatus & update variables
				//self.getStatus(self.config.host, self.config.communityWrite); 
				//self.checkVariables();
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
				self.sendCommand('individual', options.socketOff, 2);
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
				self.sendCommand('toggle', options.socketToggle, 5); //5 is dummy
			}
		};

		actions.allOn = {
			name: 'Set All Sockets On',
			options: [],
			callback: async function(event) {
				self.sendCommand('all', null, 2);
			}
		};

		actions.allOff = {
			name: 'Set All Sockets Off',
			options: [],
			callback: async function(event) {
				self.sendCommand('all', null, 3);
			}
		};

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