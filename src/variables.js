module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	initVariables: function () {
		let self = this;
		let variables = [];

		variables.push({ variableId: 'Model', name: 'Cyberpower product code' });
		variables.push({ variableId: 'SerialNumber', name: 'Serial number' });
		variables.push({ variableId: 'Firmware', name: 'Firmware version' });
		variables.push({ variableId: 'NumberSockets', name: 'Number of output sockets' });

		self.setVariableDefinitions(variables)
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this;

		let variableObj = {};

		try {
			variableObj['Model'] = self.DATA.model;
			variableObj['SerialNumber'] = self.DATA.serialNumber;
			variableObj['Firmware'] = self.DATA.firmware;
			variableObj['NumberSockets'] = self.DATA.numberSockets;

			self.setVariableValues(variableObj);
		}
		catch(error) {
			self.log('error', 'Error setting Variables from Device: ' + String(error));
		}
	}
}