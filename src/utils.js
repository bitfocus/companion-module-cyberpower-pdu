const { InstanceStatus } = require('@companion-module/base')

const snmp = require('net-snmp')

function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint16Array(buf))
}

function tenthsToString(tenths) {
	const amps = tenths / 10;
	return amps.toFixed(1);
}

function getSocketCount(self) {
	const parsed = parseInt(self.DATA.availableSockets || self.DATA.numberSockets, 10)

	if (Number.isInteger(parsed) && parsed > 0) {
		return Math.min(parsed, 18)
	}

	return 8
}

function isMissingOidError(error) {
	if (!error) {
		return false
	}

	const message = String(error)
	return message.includes('NoSuchName') || message.includes('NoSuchInstance')
}

function snmpGetChunked(session, oids, chunkSize, callback) {
	let results = []
	let index = 0

	function next() {
		if (index >= oids.length) {
			callback(null, results)
			return
		}

		const chunk = oids.slice(index, index + chunkSize)
		session.get(chunk, function (error, varbinds) {
			if (error) {
				callback(error, results)
				return
			}

			results = results.concat(varbinds)
			index += chunkSize
			next()
		})
	}

	next()
}

function snmpWalkSocketValues(session, oidPrefix, maxSockets, callback) {
	let results = []
	let index = 1

	function next() {
		if (index > maxSockets) {
			callback(null, results)
			return
		}

		session.get([`${oidPrefix}.${index}`], function (error, varbinds) {
			if (isMissingOidError(error)) {
				callback(null, results)
				return
			}

			if (error) {
				callback(error, results)
				return
			}

			const varbind = varbinds[0]
			if (snmp.isVarbindError(varbind)) {
				const varbindError = snmp.varbindError(varbind)
				if (isMissingOidError(varbindError)) {
					callback(null, results)
					return
				}

				callback(new Error(varbindError), results)
				return
			}

			results.push(varbind.value)
			index += 1
			next()
		})
	}

	next()
}

function parseSnmpValue(value) {
	if (typeof value === 'object' && value !== null) {
		return ab2str(value)
	}

	return value
}

module.exports = {
	getInfo: function(host, communityRead) {
		let self = this
		let pdu_info = []
		const maxSockets = 18
		
		let get_session = snmp.createSession (host, communityRead)
		
		const baseOids = [
			'1.3.6.1.4.1.3808.1.1.3.1.3.0', // firmware
			'1.3.6.1.4.1.3808.1.1.3.1.8.0', // number of sockets
			'1.3.6.1.4.1.3808.1.1.3.1.5.0', // model
			'1.3.6.1.4.1.3808.1.1.3.1.6.0', // serial number
		]

		snmpGetChunked(get_session, baseOids, 8, function (error, varbinds) {
			if (error) {
				self.log('error', error.toString())
				self.updateStatus(InstanceStatus.Error)
				get_session.close()
				return
			}

			for (let i = 0; i < varbinds.length; i++) {
				if (snmp.isVarbindError(varbinds[i])) {
					console.error(snmp.varbindError(varbinds[i]))
					pdu_info.push('')
				} else {
					pdu_info.push(parseSnmpValue(varbinds[i].value))
				}
			}

			const socketCount = Math.min(parseInt(pdu_info[1], 10) || 8, maxSockets)

			snmpWalkSocketValues(get_session, '1.3.6.1.4.1.3808.1.1.3.3.5.1.1.2', socketCount, function (nameError, nameValues) {
				try {
					if (nameError) {
						self.log('error', nameError.toString())
						self.updateStatus(InstanceStatus.Error)
						return
					}

					for (let i = 0; i < nameValues.length; i++) {
						pdu_info.push(parseSnmpValue(nameValues[i]))
					}

					self.DATA.availableSockets = String(nameValues.length || socketCount)

					const dataKeys = [
						'firmware', 'numberSockets', 'model', 'serialNumber'
					]
					for (let i = 1; i <= maxSockets; i++) {
						dataKeys.push(`s${i}Name`)
					}

					let dataChanged = false
					for (let i = 0; i < dataKeys.length; i++) {
						const key = dataKeys[i]
						const value = i < 4 ? pdu_info[i] : (pdu_info[i] ?? '')

						if (self.DATA[key] !== value) {
							self.DATA[key] = value
							dataChanged = true
						}
					}

					if (dataChanged) {
						self.checkVariables()
					}
				} finally {
					get_session.close()
				}
			})
		})
		return
	},
	getStatus: function(host, communityRead) {
		let self = this
		let pdu_status = []
		let nToWords = ['unknown', 'On', 'Off']
		const socketCount = getSocketCount(self)
		
		let get_session = snmp.createSession (host, communityRead)

		snmpWalkSocketValues(get_session, '1.3.6.1.4.1.3808.1.1.3.3.5.1.1.4', socketCount, function (error, statusValues) {
			try {
				if (error) {
					self.log('error', error.toString())
					self.updateStatus(InstanceStatus.Error)
					return
				}

				self.DATA.availableSockets = String(statusValues.length || socketCount)
				for (let i = 0; i < statusValues.length; i++) {
					pdu_status.push(parseSnmpValue(statusValues[i]))
				}

				const measurementOids = [
					'1.3.6.1.4.1.3808.1.1.3.2.3.1.1.2.1', // Bank amps in 0.1
					'1.3.6.1.4.1.3808.1.1.3.2.3.1.1.6.1', // Bank volts in 0.1
					'1.3.6.1.4.1.3808.1.1.3.2.3.1.1.7.1', // Bank Watts
				]

				snmpGetChunked(get_session, measurementOids, 3, function (measurementError, measurementVarbinds) {
					try {
						if (measurementError) {
							self.log('error', measurementError.toString())
							self.updateStatus(InstanceStatus.Error)
							return
						}

						for (let i = 0; i < measurementVarbinds.length; i++) {
							if (snmp.isVarbindError(measurementVarbinds[i])) {
								console.error(snmp.varbindError(measurementVarbinds[i]))
								pdu_status.push(null)
							} else {
								pdu_status.push(parseSnmpValue(measurementVarbinds[i].value))
							}
						}

						const actualSocketCount = statusValues.length || socketCount
						const statusKeys = []
						for (let i = 1; i <= 18; i++) {
							statusKeys.push(`s${i}Status`)
						}

						const measurementKeys = [
							'bankAmps', 'bankVolts'
						]

						let dataChanged = false

						for (let i = 0; i < statusKeys.length; i++) {
							const key = statusKeys[i]
							const newValue = i < actualSocketCount ? (nToWords[pdu_status[i]] || 'unknown') : ''

							if (self.DATA[key] !== newValue) {
								self.DATA[key] = newValue
								dataChanged = true
							}
						}

						for (let i = 0; i < measurementKeys.length; i++) {
							const key = measurementKeys[i]
							const rawValue = pdu_status[i + actualSocketCount]
							const newValue = rawValue == null ? '' : tenthsToString(rawValue)

							if (self.DATA[key] !== newValue) {
								self.DATA[key] = newValue
								dataChanged = true
							}
						}

						if (self.DATA.bankWatts !== pdu_status[actualSocketCount + 2]) {
							self.DATA.bankWatts = pdu_status[actualSocketCount + 2]
							dataChanged = true
						}

						if (dataChanged) {
							self.checkVariables()
							self.checkFeedbacks('SocketState')
						}
					} finally {
						get_session.close()
					}
				})
			} catch (error) {
				get_session.close()
				throw error
			}
		})
		return
	},
	sendCommand: function(control, outputValue, cmdValue) {
		let wordToN = ['unknown', 'Off', 'On'] //Note reversed values as this is used to toggle only
		let self = this;
		const maxSockets = 18;
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
			
			const statusKeys = [];
			for (let i = 1; i <= maxSockets; i++) {
				statusKeys.push(`s${i}Status`);
			}
			
			let setValue = wordToN.indexOf(self.DATA[statusKeys[outputValue-1]]);
			
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
			self.getStatus(self.config.host, self.config.communityRead); //check status
			//self.log('info','Checks Complete');
		}, 500);		
		
		setTimeout(function() {
			//self.log('info','Start Checks');
			self.getStatus(self.config.host, self.config.communityRead); //check status
			//self.log('info','Checks Complete');
		}, 1500);
		
	}
}
