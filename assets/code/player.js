function Player() {
	this.pickPower = 1;
	this.miner = new Miner('player');
	this.combatant = new Combatant('player');
	this.storage = new Storage('player');
	this.gear = new Gear('player');

	this.oxygenConsumption = 1;
	this.lastOxygenConsumption = Date.now();

	// ---------------------------------------------------------------------------
	// general
	// ---------------------------------------------------------------------------
	this.initialize = function() {
		this.miner.initialize();
		this.combatant.initialize();
		this.storage.initialize();
		this.gear.initialize();
		
		// Add the slots we can wear
		this.gear.addSlot(GearType.head);
		this.gear.addSlot(GearType.chest);
		this.gear.addSlot(GearType.mainHand);
		this.gear.addSlot(GearType.secondHand);
		this.gear.addSlot(GearType.legs);	
		this.gear.addSlot(GearType.feet);
	};
	
	this.update = function(currentTime) {
		this.miner.update(currentTime);
		this.combatant.update(currentTime);
		
		if (currentTime - this.lastOxygenConsumption > 1000) {
			// Todo: need to do something when this runs out
			if (this.storage.getItemCount(Items.oxygen.id) > 0) {
				this.storage.removeItem(Items.oxygen.id);
			}

			this.lastOxygenConsumption = currentTime;
		}
	};

	// ---------------------------------------------------------------------------
	// player functions
	// ---------------------------------------------------------------------------
	this.moveTo = function(depth) {
	    if(depth < 0) depth = 0;
	    
	    game.currentPlanet.currentDepth = depth;
	    this.miner.setDepth(game.currentPlanet.currentDepth);
	};
	
	this.moveUp = function() {
	    this.moveTo(game.currentPlanet.currentDepth - this.pickPower);
	};
	
	this.moveDown = function() {
	    this.moveTo(game.currentPlanet.currentDepth + this.pickPower);
	};
	
	this.mine = function() {
		if (!game.currentPlanet) {
			return;
		}

		game.settings.addStat('manualDigCount');

		var items = this.miner.mine();
		if (items) {
			this.storage.addItems(items);
		}
	};

	this.gather = function() {
		if (!game.currentPlanet) {
			return;
		}

		game.settings.addStat('manualGatherCount');

		var items = this.miner.gather();
		if (items) {
			this.storage.addItems(items);
		}
	};

	this.craft = function(itemId, count) {
		// For now we craft with our inventory into our inventory
		if(!game.craft(this.storage, this.storage, itemId, count)) {
			return false;
		}
		
		this.equipBestGear();
		
		return true;
	};
	
	this.equipBestGear = function() {
		// TODO: needs actual selection of best gear, right now it selects the latest found + proper pickPower assignment
		for (var key in this.storage.items)
		{
			var item = game.getItem(key);
		
			if(!item || !item.gearType) {
				continue;
			}
			
			if(item.gearType == GearType.mainHand)
			{
				this.pickPower = item.power;
			}
			
			this.equip(item.id);
		}
	};
	
	this.equip = function(itemId) {
		if(!itemId || !this.storage.hasItem(itemId))
		{
			Utils.logError("Unable to equip item, invalid or don't have it");
			return;
		}
		
		this.gear.equip(itemId, this.storage.getItemMetadata(itemId));
	};
	
	this.unEquip = function(type) {
		this.gear.unEquip(type);
	};

	// ---------------------------------------------------------------------------
	// loading / saving
	// ---------------------------------------------------------------------------
	this.save = function() {
		this.miner.save();
		this.combatant.save();
		this.storage.save();
		this.gear.save();

		localStorage.playerOxygenConsumption = this.oxygenConsumption;
	};

	this.load = function() {
		this.miner.load();
		this.combatant.load();
		this.storage.load();
		this.gear.load();

		this.oxygenConsumption = Utils.loadFloat('playerOxygenConsumption', 1);
	};

	this.reset = function(fullReset) {
		this.miner.reset(fullReset);
		this.combatant.reset(fullReset);
		this.storage.reset(fullReset);
		this.gear.reset(fullReset);
		
		this.oxygenConsumption = 1;
		this.pickPower = 1;
	};
}
