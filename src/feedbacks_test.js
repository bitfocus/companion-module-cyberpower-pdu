const { combineRgb } = require('@companion-module/base');

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		feedback1: {
			name: 'Sample Feedback',
			type: 'boolean',
			label: 'Sample',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0), // Red background
				color: combineRgb(0, 0, 0), // Black text
			},
			options: [
				{
					id: 'status',
					type: 'dropdown',
					label: 'Status',
					choices: [{ id: '00', label: 'Test' }, { id: '01', label: 'Live' }],
					default: '00',
				},
			],
			callback: ({ options }) => {
				// Example: Check if the status option is 'Live'
				return options.status === '01'; 
			},
		},
	});
}