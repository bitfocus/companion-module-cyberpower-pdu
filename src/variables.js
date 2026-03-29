module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	initVariables: function () {
		let self = this;
		let variables = [];
		const maxSockets = 18;

		variables.push({ variableId: 'Model', name: 'Cyberpower product code' });
		variables.push({ variableId: 'SerialNumber', name: 'Serial number' });
		variables.push({ variableId: 'Firmware', name: 'Firmware version' });
		variables.push({ variableId: 'NumberSockets', name: 'Number of output sockets' });
		for (let i = 1; i <= maxSockets; i++) {
			variables.push({ variableId: `Socket_${i}_Name`, name: `Socket ${i} Name` });
		}
		for (let i = 1; i <= maxSockets; i++) {
			variables.push({ variableId: `Socket_${i}_Status`, name: `Socket ${i} Status` });
		}
		variables.push({ variableId: 'Bank_Amps', name: 'Bank Amps' });
		variables.push({ variableId: 'Bank_Volts', name: 'Bank Volts' });
		variables.push({ variableId: 'Bank_Watts', name: 'Bank Watts' });

		self.setVariableDefinitions(variables)
		 
		//Check info (names, model, etc) once every 5 seconds
		try {
			setInterval(function() {
				self.getInfo(self.config.host, self.config.communityWrite);
				self.log('info', 'Name Check');
			},5000);
		}
		catch(error) {
			self.log('error', 'Error setting interval');
		}
		//Check status (bank values, socket status) once every second
		try {
			setInterval(function() {
				self.getStatus(self.config.host, self.config.communityWrite);
				self.log('info', 'Status Check');
			},1000);
		}
		catch(error) {
			self.log('error', 'Error setting interval');
		}
		
		
		self.getStatus(self.config.host, self.config.communityWrite); // update socket values on start.
		self.getInfo(self.config.host, self.config.communityWrite); // update info on intial start.
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this;

		let variableObj = {};
		const maxSockets = 18;

		try {
			variableObj['Model'] = self.DATA.model;
			variableObj['SerialNumber'] = self.DATA.serialNumber;
			variableObj['Firmware'] = self.DATA.firmware;
			variableObj['NumberSockets'] = self.DATA.numberSockets;
			for (let i = 1; i <= maxSockets; i++) {
				variableObj[`Socket_${i}_Name`] = self.DATA[`s${i}Name`];
			}
			for (let i = 1; i <= maxSockets; i++) {
				variableObj[`Socket_${i}_Status`] = self.DATA[`s${i}Status`];
			}
			variableObj['Bank_Amps'] = self.DATA.bankAmps;
			variableObj['Bank_Volts'] = self.DATA.bankVolts;
			variableObj['Bank_Watts'] = self.DATA.bankWatts;

			self.setVariableValues(variableObj);
			
			self.log('info', 'Variable Objects Updated');
		}
		catch(error) {
			self.log('error', 'Error setting Variables from Device: ' + String(error));
		}
		
	}
}
