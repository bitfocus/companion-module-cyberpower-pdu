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


		// ATS variables (only meaningful when deviceType === 'ats')
		variables.push({ variableId: 'ATS_Model', name: 'ATS Model' });
		variables.push({ variableId: 'ATS_SerialNumber', name: 'ATS Serial Number' });
		variables.push({ variableId: 'ATS_Firmware', name: 'ATS Firmware Version' });
		variables.push({ variableId: 'ATS_Device_Rating_Current', name: 'ATS Device Rating Current (A)' });
		variables.push({ variableId: 'ATS_Active_Source', name: 'ATS Active Source' });
		variables.push({ variableId: 'ATS_SourceA_Volts', name: 'ATS Source A Volts (V)' });
		variables.push({ variableId: 'ATS_SourceB_Volts', name: 'ATS Source B Volts (V)' });
		variables.push({ variableId: 'ATS_SourceA_Freq', name: 'ATS Source A Frequency (Hz)' });
		variables.push({ variableId: 'ATS_SourceB_Freq', name: 'ATS Source B Frequency (Hz)' });
		// ATS outlet names & statuses (placeholders, confirm actual count)
		for (let i = 1; i <= 8; i++) {
			variables.push({ variableId: `ATS_Outlet_${i}_Name`, name: `ATS Outlet ${i} Name` });
			variables.push({ variableId: `ATS_Outlet_${i}_Status`, name: `ATS Outlet ${i} Status` });
		}

		self.setVariableDefinitions(variables)
		 
		//Check info (names, model, etc) once every 5 seconds
		try {
			setInterval(function() {
				if (self.config.deviceType === 'ats') {
					self.getATSInfo(self.config.host, self.config.communityRead)
				} else {
					self.getInfo(self.config.host, self.config.communityWrite);
				}
			},5000);
		}
		catch(error) {
			self.log('error', 'Error setting info interval');
		}
		try {
			setInterval(function() {
				if (self.config.deviceType === 'ats') {
					self.getATSStatus(self.config.host, self.config.communityRead)
				} else {
					self.getStatus(self.config.host, self.config.communityWrite);
				}
			},1000);
		}
		catch(error) {
			self.log('error', 'Error setting status interval');
		}

		if (self.config.deviceType === 'ats') {
			self.getATSStatus(self.config.host, self.config.communityRead)
			self.getATSInfo(self.config.host, self.config.communityRead)
		} else {
			self.getStatus(self.config.host, self.config.communityWrite); 
			self.getInfo(self.config.host, self.config.communityWrite); 
		}
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
			// ATS mappings
			variableObj['ATS_Model'] = self.DATA.atsModel;
			variableObj['ATS_SerialNumber'] = self.DATA.atsSerialNumber;
			variableObj['ATS_Firmware'] = self.DATA.atsFirmware;
			variableObj['ATS_Device_Rating_Current'] = self.DATA.atsDeviceRatingCurrent;
			variableObj['ATS_Active_Source'] = self.DATA.atsActiveSource;
			variableObj['ATS_SourceA_Volts'] = self.DATA.atsSourceAVolts;
			variableObj['ATS_SourceB_Volts'] = self.DATA.atsSourceBVolts;
			variableObj['ATS_SourceA_Freq'] = self.DATA.atsSourceAFreq;
			variableObj['ATS_SourceB_Freq'] = self.DATA.atsSourceBFreq;
			for (let i = 1; i <= 8; i++) {
				variableObj[`ATS_Outlet_${i}_Name`] = self.DATA[`atsOutlet${i}Name`];
				variableObj[`ATS_Outlet_${i}_Status`] = self.DATA[`atsOutlet${i}Status`];
			}

			self.setVariableValues(variableObj);
			
			self.log('info', 'Variable Objects Updated');
		}
		catch(error) {
			self.log('error', 'Error setting Variables from Device: ' + String(error));
		}
		
	}
}