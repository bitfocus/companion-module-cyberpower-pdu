const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'dropdown',
				id: 'deviceType',
				label: 'Device Type',
				width: 6,
				choices: [
					{ id: 'pdu', label: 'PDU' },
					{ id: 'ats', label: 'ATS' }
				],
				default: 'pdu'
			},
			{
				type: 'static-text',
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
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'SNMP port',
				width: 6,
				default: '161',
				regex: Regex.Port,
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false
			},
			{
				type: 'static-text',
				id: 'info3',
				width: 12,
				label: ' ',
				value: `
				<div class="alert alert-info">
					<div>
						Enabling Verbose Logging will push all incoming and outgoing data to the log, which is helpful for debugging.
					</div>
				</div>
				`,
				isVisible: (configValues) => configValues.verbose === true,
			},
		]
	}
}