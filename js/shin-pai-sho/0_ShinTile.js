// Shin Pai Sho Tile

var ShinTileCodes = {
	Rose: 'R',
	Jasmine: 'J',
	Lily: 'I',
	Chrysanthemum: 'C',
	Dragon: 'D',
	SkyBison: 'S',
	Koi: 'K',
	Badgermole: 'B',
	LionTurtle: 'T',
	Lotus: 'L'
};

function ShinTile(code, ownerCode) {
	this.code = code;
	this.ownerCode = ownerCode;

	if (this.ownerCode === 'G') {
		this.ownerName = GUEST;
	} else if (this.ownerCode === 'H') {
		this.ownerName = HOST;
	} else {
		debug('INCORRECT OWNER CODE');
	}

	this.id = tileId++;
	this.selectedFromPile = false;
}

ShinTile.prototype.getImageName = function() {
	return this.ownerCode + '' + this.code;
};

ShinTile.prototype.getName = function() {
	return ShinTile.getTileName(this.code);
};

ShinTile.prototype.canMove = function() {
	return true;
};

ShinTile.prototype.isFlowerTile = function() {
	return [
		ShinTileCodes.Rose,
		ShinTileCodes.Jasmine,
		ShinTileCodes.Lily,
		ShinTileCodes.Chrysanthemum
	].indexOf(this.code) >= 0;
};

ShinTile.prototype.isMasterTile = function() {
	return [
		ShinTileCodes.Dragon,
		ShinTileCodes.SkyBison,
		ShinTileCodes.Koi,
		ShinTileCodes.Badgermole
	].indexOf(this.code) >= 0;
};

ShinTile.prototype.isSpiritTile = function() {
	return [
		ShinTileCodes.LionTurtle,
		ShinTileCodes.Lotus
	].indexOf(this.code) >= 0;
};

ShinTile.prototype.isLotus = function() {
	return this.code === ShinTileCodes.Lotus;
};

ShinTile.prototype.isLionTurtle = function() {
	return this.code === ShinTileCodes.LionTurtle;
};

ShinTile.prototype.getCopy = function() {
	var copy = new ShinTile(this.code, this.ownerCode);
	copy.id = this.id;
	copy.selectedFromPile = this.selectedFromPile;
	return copy;
};

ShinTile.getTileName = function(tileCode) {
	var name = '';

	if (tileCode === ShinTileCodes.Rose) {
		name = 'Rose';
	} else if (tileCode === ShinTileCodes.Jasmine) {
		name = 'Jasmine';
	} else if (tileCode === ShinTileCodes.Lily) {
		name = 'Lily';
	} else if (tileCode === ShinTileCodes.Chrysanthemum) {
		name = 'Chrysanthemum';
	} else if (tileCode === ShinTileCodes.Dragon) {
		name = 'Dragon';
	} else if (tileCode === ShinTileCodes.SkyBison) {
		name = 'Sky Bison';
	} else if (tileCode === ShinTileCodes.Koi) {
		name = 'Koi';
	} else if (tileCode === ShinTileCodes.Badgermole) {
		name = 'Badgermole';
	} else if (tileCode === ShinTileCodes.LionTurtle) {
		name = 'Lion Turtle';
	} else if (tileCode === ShinTileCodes.Lotus) {
		name = 'Lotus';
	}

	return name;
};
