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
		variables.push({ variableId: 'Socket_1_Name', name: 'Socket 1 Name' });
		variables.push({ variableId: 'Socket_2_Name', name: 'Socket 2 Name' });
		variables.push({ variableId: 'Socket_3_Name', name: 'Socket 3 Name' });
		variables.push({ variableId: 'Socket_4_Name', name: 'Socket 4 Name' });
		variables.push({ variableId: 'Socket_5_Name', name: 'Socket 5 Name' });
		variables.push({ variableId: 'Socket_6_Name', name: 'Socket 6 Name' });
		variables.push({ variableId: 'Socket_7_Name', name: 'Socket 7 Name' });
		variables.push({ variableId: 'Socket_8_Name', name: 'Socket 8 Name' });
		//variables.push({ variableId: 'Socket_1_Status', name: 'Socket 1 Status' });

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
			variableObj['Socket_1_Name'] = self.DATA.s1Name;
			variableObj['Socket_2_Name'] = self.DATA.s2Name;
			variableObj['Socket_3_Name'] = self.DATA.s3Name;
			variableObj['Socket_4_Name'] = self.DATA.s4Name;
			variableObj['Socket_5_Name'] = self.DATA.s5Name;
			variableObj['Socket_6_Name'] = self.DATA.s6Name;
			variableObj['Socket_7_Name'] = self.DATA.s7Name;
			variableObj['Socket_8_Name'] = self.DATA.s8Name;
			//variableObj['Socket_1_Status'] = self.DATA.s1Status;
			//variableObj['Status8'] = self.DATA.s8Status;

			self.setVariableValues(variableObj);
		}
		catch(error) {
			self.log('error', 'Error setting Variables from Device: ' + String(error));
		}
	}
}