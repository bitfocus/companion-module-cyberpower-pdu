// CyberPower PDU
const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const presets = require('./src/presets')

const constants = require('./src/constants')
const utils = require('./src/utils')

class cyberpowerPDUInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...constants,
			...utils
		})

		this.DATA = {
			firmware: '',
			numberSockets: '',
			model: '',
			serialNumber: '',
			s1Status: '',
		};
	}

	async destroy() {

	}

	async init(config) {
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.updateStatus(InstanceStatus.Ok)
		
		this.config = config
		
		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.checkVariables()
		this.initPresets()

		//this.getInfo(this.config.host, this.config.communityRead);
	}
	
}

runEntrypoint(cyberpowerPDUInstance, UpgradeScripts)
