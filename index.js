var instance_skel = require('../../instance_skel')
var snmp = require('net-snmp')

// var feedback      = require('./feedback');
var presets = require('./presets')
var debug
var log

function instance(system, id, config) {
	var self = this

	// super-constructor
	instance_skel.apply(this, arguments)

	return self
}

instance.prototype.updateConfig = function (config) {
	var self = this
	self.config = config
	self.setVariable('Firmware',null);
	self.setVariable('NumberSockets',null);
	self.setVariable('Model',null);
	self.setVariable('SerialNumber',null);		
	self.getInfo(self.config.host, self.config.communityRead);
	self.actions()
}

instance.prototype.init = function () {
	var self = this

	debug = self.debug
	log = self.log

	self.setVariableDefinitions( [
		{
			label: 'Cyberpower product code',
			name: 'Model',
		},
		{
			label: 'Serial number',
			name: 'SerialNumber',
		},
		{
			label: 'Firmware version',
			name: 'Firmware',
		},
		{
			label: 'Number of output sockets',
			name: 'NumberSockets',
		},
	])
	
	self.status(self.STATE_OK)
	self.presets()
	self.getInfo(self.config.host, self.config.communityRead)
	self.actions() // export actions
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module is for the Cyberpower PDU products with SNMP control',
		},
		{
			type: 'textinput',
			id: 'communityRead',
			label: 'Community read string',
			width: 6,
			default: 'public',
		},
		{
			type: 'textinput',
			id: 'communityWrite',
			label: 'Community write string',
			width: 6,
			default: 'private',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Device IP',
			width: 6,
			regex: self.REGEX_IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'SNMP port',
			width: 6,
			default: '161',
			regex: self.REGEX_PORT,
		},
	]
}

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this
	self.setVariable('Firmware',null);
	self.setVariable('NumberSockets',null);
	self.setVariable('Model',null);
	self.setVariable('SerialNumber',null);	
	debug('destroy', self.id)
}

instance.prototype.presets = function () {
	var self = this
	self.setPresetDefinitions(presets.getPresets(self.label))
}

instance.prototype.actions = function (system) {
	var self = this

	// TODO: Read output labels from device and create dropdown
	self.setActions({
		switchOn: {
			label: 'Set Output Socket On',
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
		},
		switchOff: {
			label: 'Set Output Socket Off',
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
		},
		allOn: {
			label: 'Set All Sockets On'
		},
		allOff: {
			label: 'Set All Sockets Off'
		},
	})
}

instance.prototype.action = function (action) {
	var self = this
	const opt = action.options
	var cmdValue = 0
	var control = ''

	// SNMP Options
	var snmp_options = {
		port: self.config.port,
		version: snmp.Version1,
		backwardsGetNexts: true,
		idBitsSize: 32,
	}

	switch (action.action) {
		case 'switchOn': {
			control = 'individual'
			outputValue = opt.socketOn
			cmdValue = 1
			break
		}
		case 'switchOff': {
			control = 'individual'
			outputValue = opt.socketOff
			cmdValue = 2
			break
		}
		case 'allOn': {
			control = 'all'
			cmdValue = 2
			break
		}
		case 'allOff': {
			control = 'all'
			cmdValue = 3
			break
		}
		default:
			break
	}

	// Build oid and value for output socket
	if (control == 'individual') {
		var varbinds = [
			{
				oid: '1.3.6.1.4.1.3808.1.1.3.3.3.1.1.4.' + (outputValue), // was (outputValue - 1), assume that iPower starts from 0. Cyberpower starts at 1.
				type: snmp.ObjectType.Integer,
				value: cmdValue,
			},
		]
	}
	if (control == 'all') {
		var varbinds = [
			{
				oid: '1.3.6.1.4.1.3808.1.1.3.3.1.1.0', // different OID for ePDUOutletDevCommand
				type: snmp.ObjectType.Integer,
				value: cmdValue,
			},
		]
	}

	// Create new session and send set command
	var snmp_session = snmp.createSession(self.config.host, self.config.communityWrite, snmp_options)
	snmp_session.set(varbinds, function (error, varbinds) {
		if (error) {
			 self.log('warn',error.toString ());
		} else {
			for (var i = 0; i < varbinds.length; i++) {
				// for version 1 we can assume all OIDs were successful
				self.log('info', varbinds[i].oid + '|' + varbinds[i].value)

				// for version 2c we must check each OID for an error condition
				if (snmp.isVarbindError(varbinds[i])) self.log('error', snmp.varbindError(varbinds[i]))
				else self.log('info', varbinds[i].oid + '|' + varbinds[i].value)
			}
		}
		snmp_session.close()
	})
}

instance.prototype.getInfo = function (host,communityRead) {

	var self = this
	var pdu_info = []
	var get_session = snmp.createSession (host, communityRead)
	
	// firmware, number of sockets, model, serial number
	var oids = ['1.3.6.1.4.1.3808.1.1.3.1.3.0','1.3.6.1.4.1.3808.1.1.3.1.8.0','1.3.6.1.4.1.3808.1.1.3.1.5.0','1.3.6.1.4.1.3808.1.1.3.1.6.0'];
	
	get_session.get (oids, function (error, varbinds) {
		if (error) {
			self.log('error',error.toString ())
		} else {
			for (var i = 0; i < varbinds.length; i++) {
				// for version 1 we can assume all OIDs were successful
				console.log (varbinds[i].oid + '|' + varbinds[i].value)
				// for version 2c we must check each OID for an error condition
				if (snmp.isVarbindError (varbinds[i]))
					console.error (snmp.varbindError (varbinds[i]))
				else {
					console.log (varbinds[i].oid + '|' + varbinds[i].value);
					if (typeof varbinds[i].value === 'object' && varbinds[i].value !== null ) {
						// self.log('info',self.ab2str(varbinds[i].value));
						pdu_info.push(self.ab2str(varbinds[i].value))
					} else {
						// self.log('info',varbinds[i].value);
						pdu_info.push(varbinds[i].value)
					}
				}
			}
		}

		self.setVariable('Firmware',pdu_info[0])
		self.setVariable('NumberSockets',pdu_info[1])
		self.setVariable('Model',pdu_info[2])
		self.setVariable('SerialNumber',pdu_info[3])	
		get_session.close()
	})
	return
}

instance.prototype.ab2str = function (buf) {
	return String.fromCharCode.apply(null, new Uint16Array(buf))
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
