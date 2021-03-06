"use strict";

const path = require('path'),
	  pluginUtils = require('steamer-pluginutils');

var utils = new pluginUtils();
utils.pluginName = "steamer";

function ConfigPlugin(argv) {
	this.argv = argv;
	this.globalConfigFolder = path.join(__dirname, "../");
	this.localConfigFolder = path.resolve();
}

ConfigPlugin.prototype.init  = function() {
	let argv = this.argv;

	if (argv.init || argv.i) {
		this.createConfig();
	}
	else if (argv.set || argv.s) {
		this.set();
	}
	else if (argv.del || argv.d) {
		this.del();
	}
	else if (argv.list || argv.l) {
		this.list();
	}
};

ConfigPlugin.prototype.createConfig  = function() {
	let isJs = true,
		isForce = false,
		targetName = "steamer";

	var utils = new pluginUtils();
	// set steamertemplate in order to read steamertemplate.js file
	utils.pluginName = "steamertemplate"; 
	
	let config = utils.readConfig(this.globalConfigFolder, isJs);

	utils.createConfig("", config, isJs, isForce, targetName);
};

ConfigPlugin.prototype.getKeyValue  = function() {
	let argv = this.argv,
		kv = argv.set || argv.s,
		kvArr = (kv && kv !== true) ? kv.split("=") : [];

	let key = (kvArr.length > 0) ? kvArr[0] : "",
		value = (kvArr.length > 1) ? kvArr[1] : "";

	return {key, value};
};

ConfigPlugin.prototype.set  = function() {
	
	let kv = this.getKeyValue(),
		config = this.readConfig();

	config[kv.key] = kv.value;

	let isJs = true,
		isForce = true,
		isGlobal = this.argv.global || this.argv.g,
		configFolder = isGlobal ? this.globalConfigFolder : this.localConfigFolder;

	utils.createConfig(configFolder, config, isJs, isForce);

};

ConfigPlugin.prototype.del  = function() {
	let argv = this.argv,
		key = argv.del || argv.d,
		config = this.readConfig();

	delete config[key];

	let isJs = true,
		isForce = true,
		isGlobal = this.argv.global || this.argv.g,
		configFolder = isGlobal ? this.globalConfigFolder : this.localConfigFolder;
	
	utils.createConfig(configFolder, config, isJs, isForce);
};

ConfigPlugin.prototype.readConfig  = function() {
	let isJs = true,
		isGlobal = this.argv.global || this.argv.g,
		configFolder = isGlobal ? this.globalConfigFolder : this.localConfigFolder;

	return utils.readConfig(configFolder, isJs);
};

ConfigPlugin.prototype.list  = function() {
	return utils.info(this.readConfig());
};

module.exports = ConfigPlugin;