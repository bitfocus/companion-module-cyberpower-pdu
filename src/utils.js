const { InstanceStatus } = require('@companion-module/base')

const snmp = require('net-snmp')

function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint16Array(buf))
}

module.exports = {
	getInfo: function(host, communityRead) {
		let self = this
		let pdu_info = []
		let get_session = snmp.createSession (host, communityRead)
		
		// firmware, number of sockets, model, serial number
		//let oids = ['1.3.6.1.4.1.3808.1.1.3.1.3.0','1.3.6.1.4.1.3808.1.1.3.1.8.0','1.3.6.1.4.1.3808.1.1.3.1.5.0','1.3.6.1.4.1.3808.1.1.3.1.6.0'];
		let oids = [
		'1.3.6.1.4.1.3808.1.1.3.1.3.0', // firmware
		'1.3.6.1.4.1.3808.1.1.3.1.8.0',
		'1.3.6.1.4.1.3808.1.1.3.1.5.0',
		'1.3.6.1.4.1.3808.1.1.3.1.6.0',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.1',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.2',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.3',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.4',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.5',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.6',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.7',
		'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2.8'//,
		//'1.3.6.1.4.1.3808.1.1.3.3.5.1.1.4.1'  //S1 State
		];

		//let oids = ['1.3.6.1.4.1.3808.1.1.3.1.3.0','1.3.6.1.4.1.3808.1.1.3.1.8.0','1.3.6.1.4.1.3808.1.1.3.1.5.0','1.3.6.1.4.1.3808.1.1.3.1.6.0','1.3.6.1.4.1.3808.1.1.3.3.5.1.1'];
		
		get_session.get (oids, function (error, varbinds) {
			if (error) {
				self.log('error',error.toString())
				self.updateStatus(InstanceStatus.Error);
			} else {
				for (let i = 0; i < varbinds.length; i++) {
					// for version 1 we can assume all OIDs were successful
					self.log ('info', varbinds[i].oid + '|' + varbinds[i].value)
					// for version 2c we must check each OID for an error condition
					if (snmp.isVarbindError (varbinds[i]))
						console.error (snmp.varbindError (varbinds[i]))
					else {
						self.log ('info' ,varbinds[i].oid + '|' + varbinds[i].value);
						if (typeof varbinds[i].value === 'object' && varbinds[i].value !== null ) {
							pdu_info.push(ab2str(varbinds[i].value))
						} else {
							// self.log('info',varbinds[i].value);
							pdu_info.push(varbinds[i].value)
						}
					}
				}
			}
	
			self.DATA.firmware = pdu_info[0]
			self.DATA.numberSockets = pdu_info[1]
			self.DATA.model = pdu_info[2]
			self.DATA.serialNumber = pdu_info[3]
			self.DATA.s1Name = pdu_info[4]
			self.DATA.s2Name = pdu_info[5]
			self.DATA.s3Name = pdu_info[6]
			self.DATA.s4Name = pdu_info[7]
			self.DATA.s5Name = pdu_info[8]
			self.DATA.s6Name = pdu_info[9]
			self.DATA.s7Name = pdu_info[10]
			self.DATA.s8Name = pdu_info[11]
			//self.DATA.s1Status = pdu_info[12]
			
			
			
			//self.DATA.s8Status = pdu_info[4] //added
			
			self.checkVariables()
			get_session.close()
		})
		return;
	},
	
	
	getTable: function(host, communityRead) {
		let self = this;
		//let pdu_info = []
		
		let table_session = snmp.createSession(host, communityRead);
		
	    let oid = '1.3.6.1.4.1.3808.1.1.3.3.5.1.1';
		
		self.log ('info', "Table Read Zone");
		
		table_session.table(oid, function(error, table) {
			self.log ('info', "Table Loading...");
			if (error) {
				self.log('warn', 'SNMP Error:' + error);
				//table_session.close();
			} else {
				//self.log('info',table);	
				for (const [index, row] of Object.entries(table)) {
					self.log('info', 'Row ${index}:');
				    for (const [columnOid, value] of Object.entries(row)) {
						self.log('info', '  ${columnOid}: ${value.value}');
				    }
				}
				//table_session.close();
			}
			//table_session.close();
			//self.log('info', "Session Closed");
		});
		
    },

	
		

	sendCommand: function(control, outputValue, cmdValue) {
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

		// Create new session and send set command
		let snmp_session = snmp.createSession(self.config.host, self.config.communityWrite, snmp_options)
		snmp_session.set(varbinds, function (error, varbinds) {
			if (error) {
				self.log('warn',error.toString ());
			} else {
				for (let i = 0; i < varbinds.length; i++) {
					// for version 1 we can assume all OIDs were successful
					self.log('info', varbinds[i].oid + '|' + varbinds[i].value)

					// for version 2c we must check each OID for an error condition
					if (snmp.isVarbindError(varbinds[i])) self.log('error', snmp.varbindError(varbinds[i]))
					else self.log('info', varbinds[i].oid + '|' + varbinds[i].value)
				}
			}
			snmp_session.close()
		});
	}
	
	//responseCb(){
		//self.log('info',"responseCb");
	//}
}