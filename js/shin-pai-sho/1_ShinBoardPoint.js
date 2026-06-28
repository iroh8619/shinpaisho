// Shin Board Point

var SHIN_RAAVA = 'RAAVA';
var SHIN_VAATU = 'VAATU';
var SHIN_RAAVAATU = 'RAAVAATU';
var SHIN_SPIRIT_WILDS = 'SPIRIT_WILDS';
var SHIN_MOUNTAIN = 'MOUNTAIN';

function ShinBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
	this.tile = null;
}

ShinBoardPoint.prototype.addType = function(type) {
	if (this.types.indexOf(type) < 0) {
		this.types.push(type);
	}
};

ShinBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
			i--;
		}
	}
};

ShinBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

ShinBoardPoint.prototype.removeTile = function() {
	var tile = this.tile;
	this.tile = null;
	return tile;
};

ShinBoardPoint.prototype.hasTile = function() {
	return !!this.tile;
};

ShinBoardPoint.prototype.isType = function(type) {
	return this.types.indexOf(type) >= 0;
};

ShinBoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.isType(SHIN_MOUNTAIN);
};

ShinBoardPoint.prototype.getCopy = function() {
	var copy = new ShinBoardPoint();
	copy.types = copyArray(this.types);
	copy.row = this.row;
	copy.col = this.col;

	if (this.hasTile() && this.tile.getCopy) {
		copy.tile = this.tile.getCopy();
	}

	return copy;
};

ShinBoardPoint.spiritWilds = function() {
	var point = new ShinBoardPoint();
	point.addType(SHIN_SPIRIT_WILDS);
	return point;
};

ShinBoardPoint.raava = function() {
	var point = new ShinBoardPoint();
	point.addType(SHIN_RAAVA);
	return point;
};

ShinBoardPoint.vaatu = function() {
	var point = new ShinBoardPoint();
	point.addType(SHIN_VAATU);
	return point;
};

ShinBoardPoint.raavaatu = function() {
	var point = new ShinBoardPoint();
	point.addType(SHIN_RAAVA);
	point.addType(SHIN_VAATU);
	point.addType(SHIN_RAAVAATU);
	return point;
};

ShinBoardPoint.mountain = function() {
	var point = new ShinBoardPoint();
	point.addType(SHIN_MOUNTAIN);
	return point;
};

ShinBoardPoint.nonPlayable = function() {
	var point = new ShinBoardPoint();
	point.addType(NON_PLAYABLE);
	return point;
};
