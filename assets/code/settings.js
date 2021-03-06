function Settings() {
	this.totalStats = new Statistics('total');
	this.sessionStats = new Statistics('session');

	this.autoSaveEnabled = true;
	this.autoSaveInterval = 60 * 1000;
	
	this.savedVersion = 0;

	this.currentPlanet;

	this.travelActive;
	this.travelDistanceRemaining;
	this.travelDistanceElapsed;
	
	// UI settings
	this.selectedPlayerInventoryFilter = 1;
	
	this.isNewGame = true;
	
	// ---------------------------------------------------------------------------
	// general
	// ---------------------------------------------------------------------------
	this.initialize = function() {
		this.totalStats.initialize();
		this.sessionStats.initialize();
	};

	// ---------------------------------------------------------------------------
	// stats
	// ---------------------------------------------------------------------------
	this.addStat = function(key, value) {
		if (!value) {
			this.totalStats[key]++;
			this.sessionStats[key]++;
			return;
		}

		this.totalStats[key] += value;
		this.sessionStats[key] += value;
	};

	// ---------------------------------------------------------------------------
	// loading / saving / reset
	// ---------------------------------------------------------------------------
	this.save = function() {
		this.totalStats.save();
		this.sessionStats.save();

		localStorage.currentPlanet = this.currentPlanet;

		localStorage.autoSaveEnabled = this.autoSaveEnabled;
		localStorage.autoSaveInterval = this.autoSaveInterval;
		
		localStorage.savedVersion = this.savedVersion;

		localStorage.travelActive = this.travelActive;
		localStorage.travelDistanceRemaining = this.travelDistanceRemaining;
		localStorage.travelDistanceElapsed = this.travelDistanceElapsed;
		
		localStorage.selectedPlayerInventoryFilter = this.selectedPlayerInventoryFilter;
		
		localStorage.isNewGame = this.newGame;
	};

	this.load = function() {
		this.totalStats.load();
		this.sessionStats.load();

		this.currentPlanet = Utils.loadInt("currentPlanet", 0);

		this.autoSaveEnabled = Utils.loadBool("autoSaveEnabled", true);
		this.autoSaveInterval = Utils.loadInt("autoSaveInterval", 60 * 1000);
		
		this.savedVersion = Utils.loadFloat("savedVersion", 0);

		this.travelActive = Utils.loadBool("travelActive", 0);
		this.travelDistanceRemaining = Utils.loadFloat(
				"travelDistanceRemaining", 0);
		this.travelDistanceElapsed = Utils
				.loadFloat("travelDistanceElapsed", 0);
		
		this.selectedPlayerInventoryFilter = Utils.loadInt('selectedPlayerInventoryFilter', 1);
		
		this.isNewGame = Utils.loadBool("isNewGame", true);
	};

	this.reset = function(fullReset) {
		this.sessionStats = new Statistics('session');
		this.sessionStats.initialize();

		this.currentPlanet = 0;

		this.travelActive = false;
		this.travelDistanceRemaining = 0;
		this.travelDistanceElapsed = 0;
		
		this.isNewGame = true;

		if (fullReset) {
			this.totalStats = new Statistics('total');
			this.totalStats.initialize();
		}
	};
}
