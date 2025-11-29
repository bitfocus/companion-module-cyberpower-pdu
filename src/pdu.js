const { InstanceStatus } = require('@companion-module/base')
const snmp = require('net-snmp')

function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint16Array(buf))
}

function tenthsToString(tenths) {
	const amps = tenths / 10;
	return amps.toFixed(1);
}

module.exports = {
	getInfo: function(host, communityRead) {
		let self = this
		let pdu_info = []
		
		let get_session = snmp.createSession (host, communityRead)
		
		// firmware, number of sockets, model, serial number
		let oids = [
		'1.3.6.1.4.1.3808.1.1.3.1.3.0', //firmware
		'1.3.6.1.4.1.3808.1.1.3.1.8.0', //number of sockets
		'1.3.6.1.4.1.3808.1.1.3.1.5.0', //model
		'1.3.6.1.4.1.3808.1.1.3.1.6.0', //serial number
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.1', //socket 1 name
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.2', //socket 2 name
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.3',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.4',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.5',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.6',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.7',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.8', //socket 8 name	
		];

		
		get_session.get (oids, function (error, varbinds) {
			if (error) {
				self.log('error',error.toString())
				self.updateStatus(InstanceStatus.Error);
			} else {
				for (let i = 0; i < varbinds.length; i++) {
					// for version 1 we can assume all OIDs were successful
					//self.log ('info', varbinds[i].oid + '|' + varbinds[i].value)
					// for version 2c we must check each OID for an error condition
					if (snmp.isVarbindError (varbinds[i]))
						console.error (snmp.varbindError (varbinds[i]))
					else {
						//self.log ('info' ,varbinds[i].oid + '|' + varbinds[i].value);
						if (typeof varbinds[i].value === 'object' && varbinds[i].value !== null ) {
							pdu_info.push(ab2str(varbinds[i].value))
						} else {
							// self.log('info',varbinds[i].value);
							pdu_info.push(varbinds[i].value)
						}
					}
				}
			}
			
			get_session.close()
			
			const dataKeys = [
				'firmware', 'numberSockets', 'model', 'serialNumber',
				's1Name', 's2Name', 's3Name', 's4Name',
				's5Name', 's6Name', 's7Name', 's8Name'
			];

			let dataChanged = false;

			for (let i = 0; i < dataKeys.length; i++) {
				const key = dataKeys[i];
				if (self.DATA[key] !== pdu_info[i]) {
					self.DATA[key] = pdu_info[i];
					dataChanged = true;
				}
			}

			if (dataChanged) {
				//self.log('info', 'Update Core Triggered');
				self.checkVariables() // only update core when there are changes.
			}
		})
		return;
	},
	getStatus: function(host, communityRead) {
		let self = this
		let pdu_info = []
		let pdu_status = []
		let nToWords = ['unknown', 'On', 'Off']
		
		let get_session = snmp.createSession (host, communityRead)
		
		// firmware, number of sockets, model, serial number

		let oids = [
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.4.1',  //socket state (1) = on, (2) = off
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.4.2', 
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.4.3', 
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.4.4', 
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.4.5', 
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.4.6', 
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.4.7', 
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.4.8', 
		'1.3.6.1.4.1.3808.1.1.3.2.3.1.1.2.1', // Bank amps in 0.1
		'1.3.6.1.4.1.3808.1.1.3.2.3.1.1.6.1', // Bank volts in 0.1
		'1.3.6.1.4.1.3808.1.1.3.2.3.1.1.7.1', // Bank Watts
		
		];

		
		get_session.get (oids, function (error, varbinds) {
			if (error) {
				self.log('error',error.toString())
				self.updateStatus(InstanceStatus.Error);
			} else {
				for (let i = 0; i < varbinds.length; i++) {
					// for version 1 we can assume all OIDs were successful
					//self.log ('info', varbinds[i].oid + '|' + varbinds[i].value)
					// for version 2c we must check each OID for an error condition
					if (snmp.isVarbindError (varbinds[i]))
						console.error (snmp.varbindError (varbinds[i]))
					else {
						//self.log ('info' ,varbinds[i].oid + '|' + varbinds[i].value);
						if (typeof varbinds[i].value === 'object' && varbinds[i].value !== null ) {
							pdu_status.push(ab2str(varbinds[i].value))
						} else {
							// self.log('info',varbinds[i].value);
							pdu_status.push(varbinds[i].value)
						}
					}
				}
			}
			
			get_session.close()
			
			// update variables and trigger update to core if required.
			const statusKeys = [
				's1Status', 's2Status', 's3Status', 's4Status',
				's5Status', 's6Status', 's7Status', 's8Status'
			];

			const measurementKeys = [
				'bankAmps', 'bankVolts'
			]

			let dataChanged = false;

			for (let i = 0; i < statusKeys.length; i++) {
				const key = statusKeys[i];
				const newValue = nToWords[pdu_status[i]];

				if (self.DATA[key] !== newValue) {
					self.DATA[key] = newValue;
					dataChanged = true;
				}
			}

			for (let i = 0; i < measurementKeys.length; i++){
				const key = measurementKeys[i];
				const newValue = tenthsToString(pdu_status[i+8]); //pdu_status starts at 0, and we want 8 and 9

				if (self.DATA[key] !== newValue) {
					self.DATA[key] = newValue;
					dataChanged = true;
				}
			}

			if (self.DATA.bankWatts !== pdu_status[10]) {
				self.DATA.bankWatts = pdu_status[10];
				dataChanged = true;
			}


			if (dataChanged) {
				self.checkVariables()
				self.checkFeedbacks('SocketState');
			}
				
		})
		return;
	},
	sendCommand: function(control, outputValue, cmdValue) {
		let wordToN = ['unknown', 'Off', 'On'] //Note reversed values as this is used to toggle only
		let self = this;
		// SNMP Options
		let snmp_options = {
			port: self.config.port,
			version: snmp.Version1,
			backwardsGetNexts: true,
			idBitsSize: 32,
		}

		let varbinds;

		// Build oid and value for output socket
		if (control == 'individual') {
			varbinds = [
				{
					oid: '1.3.6.1.4.1.3808.1.1.3.3.3.1.1.4.' + (outputValue), // was (outputValue - 1), assume that iPower starts from 0. Cyberpower starts at 1.
					type: snmp.ObjectType.Integer,
					value: cmdValue,
				}
			]
		}
		if (control == 'all') {
			varbinds = [
				{
					oid: '1.3.6.1.4.1.3808.1.1.3.3.1.1.0', // different OID for ePDUOutletDevCommand
					type: snmp.ObjectType.Integer,
					value: cmdValue,
				}
			]
		}
		if (control == 'toggle') {
			
			const statusKeys = [  //probably a better way than copying above here
				's1Status', 's2Status', 's3Status', 's4Status',
				's5Status', 's6Status', 's7Status', 's8Status'
			];
			
			setValue = wordToN.indexOf(self.DATA[statusKeys[outputValue-1]]);
			
			varbinds = [
				{
					oid: '1.3.6.1.4.1.3808.1.1.3.3.3.1.1.4.' + (outputValue),
					type: snmp.ObjectType.Integer,
					value: setValue,
				}
			]
			
			
		}

		// Create new session and send set command
		let snmp_session = snmp.createSession(self.config.host, self.config.communityWrite, snmp_options)
		snmp_session.set(varbinds, function (error, varbinds) {
			if (error) {
				self.log('warn',error.toString ());
			} else {
				for (let i = 0; i < varbinds.length; i++) {
					// for version 1 we can assume all OIDs were successful
					//self.log('info', varbinds[i].oid + '|' + varbinds[i].value)

					// for version 2c we must check each OID for an error condition
					if (snmp.isVarbindError(varbinds[i])) self.log('error', snmp.varbindError(varbinds[i]))
					//else self.log('info', varbinds[i].oid + '|' + varbinds[i].value)
				}
			}
						
			//self.checkVariables() // submit updates
			//self.checkFeedbacks('SocketState');  //submit updates
			snmp_session.close()
		});
		
		//Check 1/2 second and 1.5 seconds after command to verify status update.
		
		setTimeout(function() {
			//self.log('info','Start Checks');
			self.getStatus(self.config.host, self.config.communityWrite); //check status
			//self.log('info','Checks Complete');
		}, 500);		
		
		setTimeout(function() {
			//self.log('info','Start Checks');
			self.getStatus(self.config.host, self.config.communityWrite); //check status
			//self.log('info','Checks Complete');
		}, 1500);
		
	}
}
