// Shin Pai Sho Tile Manager

function ShinTileManager() {
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
	this.capturedTiles = [];
}

ShinTileManager.prototype.loadTileSet = function(ownerCode) {
	var tiles = [];

	tiles.push(new ShinTile(ShinTileCodes.Rose, ownerCode));
	tiles.push(new ShinTile(ShinTileCodes.Jasmine, ownerCode));
	tiles.push(new ShinTile(ShinTileCodes.Lily, ownerCode));
	tiles.push(new ShinTile(ShinTileCodes.Chrysanthemum, ownerCode));
	tiles.push(new ShinTile(ShinTileCodes.Dragon, ownerCode));
	tiles.push(new ShinTile(ShinTileCodes.SkyBison, ownerCode));
	tiles.push(new ShinTile(ShinTileCodes.Koi, ownerCode));
	tiles.push(new ShinTile(ShinTileCodes.Badgermole, ownerCode));
	tiles.push(new ShinTile(ShinTileCodes.LionTurtle, ownerCode));
	tiles.push(new ShinTile(ShinTileCodes.Lotus, ownerCode));

	return tiles;
};

ShinTileManager.prototype.getTilePile = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}
	return tilePile;
};

ShinTileManager.prototype.grabTile = function(player, tileCode, tileId) {
	var tilePile = this.getTilePile(player);

	if (tileId) {
		for (var i = 0; i < tilePile.length; i++) {
			if (tilePile[i].id === tileId) {
				return tilePile.splice(i, 1)[0];
			}
		}
	}

	for (var j = 0; j < tilePile.length; j++) {
		if (tilePile[j].code === tileCode) {
			return tilePile.splice(j, 1)[0];
		}
	}

	debug('NONE OF THAT TILE FOUND');
};

ShinTileManager.prototype.peekTile = function(player, tileCode, tileId) {
	var tilePile = this.getTilePile(player);
	var tile;

	if (tileId) {
		for (var i = 0; i < tilePile.length; i++) {
			if (tilePile[i].id === tileId) {
				return tilePile[i];
			}
		}
	}

	for (var j = 0; j < tilePile.length; j++) {
		if (tilePile[j].code === tileCode) {
			tile = tilePile[j];
			break;
		}
	}

	if (!tile) {
		debug('NONE OF THAT TILE FOUND');
	}

	return tile;
};

ShinTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

ShinTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.getTilePile(player);

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

ShinTileManager.prototype.putTileBack = function(tile) {
	var tilePile = this.getTilePile(tile.ownerName);
	tilePile.push(tile);
};

ShinTileManager.prototype.getCopy = function() {
	var copy = new ShinTileManager();

	copy.hostTiles = this.hostTiles.map(function(tile) {
		return tile.getCopy();
	});
	copy.guestTiles = this.guestTiles.map(function(tile) {
		return tile.getCopy();
	});
	copy.capturedTiles = this.capturedTiles.map(function(tile) {
		return tile.getCopy();
	});

	return copy;
};
