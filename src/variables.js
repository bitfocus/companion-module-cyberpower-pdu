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
		variables.push({ variableId: 'Socket_1_Status', name: 'Socket 1 Status' });
		variables.push({ variableId: 'Socket_2_Status', name: 'Socket 2 Status' });
		variables.push({ variableId: 'Socket_3_Status', name: 'Socket 3 Status' });
		variables.push({ variableId: 'Socket_4_Status', name: 'Socket 4 Status' });
		variables.push({ variableId: 'Socket_5_Status', name: 'Socket 5 Status' });
		variables.push({ variableId: 'Socket_6_Status', name: 'Socket 6 Status' });
		variables.push({ variableId: 'Socket_7_Status', name: 'Socket 7 Status' });
		variables.push({ variableId: 'Socket_8_Status', name: 'Socket 8 Status' });
		variables.push({ variableId: 'Bank_Amps', name: 'Bank Amps' });
		variables.push({ variableId: 'Bank_Volts', name: 'Bank Volts' });
		variables.push({ variableId: 'Bank_Watts', name: 'Bank Watts' });

		self.setVariableDefinitions(variables)
		 
		//removed inerval updates and only updates on action change.  
		//TODO: Update based on external updates? AKA: check regularly but only update core on changes.
		/*
		
		try {
			setInterval(function() {
				self.getStatus(self.config.host, self.config.communityWrite); 
				self.checkVariables();
			},1000); //update every second;
			//self.log('info', 'interval set!');
			self.getStatus(self.config.host, self.config.communityWrite); 
			//self.log('info', 'initial status checked');
			self.checkVariables();
			//self.log('info', 'variables checked.');
		}
		catch(error) {
			//self.log('error', 'Error setting interval: ' + String(error));
		}
		*/
		
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
			variableObj['Socket_1_Status'] = self.DATA.s1Status;
			variableObj['Socket_2_Status'] = self.DATA.s2Status;
			variableObj['Socket_3_Status'] = self.DATA.s3Status;
			variableObj['Socket_4_Status'] = self.DATA.s4Status;
			variableObj['Socket_5_Status'] = self.DATA.s5Status;
			variableObj['Socket_6_Status'] = self.DATA.s6Status;
			variableObj['Socket_7_Status'] = self.DATA.s7Status;
			variableObj['Socket_8_Status'] = self.DATA.s8Status;
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