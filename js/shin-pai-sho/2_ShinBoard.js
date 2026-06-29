// Shin Board

var SHIN_FLOWER_TO_MASTER = {};
SHIN_FLOWER_TO_MASTER[ShinTileCodes.Rose] = ShinTileCodes.Dragon;
SHIN_FLOWER_TO_MASTER[ShinTileCodes.Jasmine] = ShinTileCodes.SkyBison;
SHIN_FLOWER_TO_MASTER[ShinTileCodes.Lily] = ShinTileCodes.Koi;
SHIN_FLOWER_TO_MASTER[ShinTileCodes.Chrysanthemum] = ShinTileCodes.Badgermole;

var SHIN_BOND_TO_ELEMENT = {};
SHIN_BOND_TO_ELEMENT[ShinTileCodes.Rose] = 'fire';
SHIN_BOND_TO_ELEMENT[ShinTileCodes.Jasmine] = 'air';
SHIN_BOND_TO_ELEMENT[ShinTileCodes.Lily] = 'water';
SHIN_BOND_TO_ELEMENT[ShinTileCodes.Chrysanthemum] = 'earth';

var SHIN_ELEMENT_TO_MASTER = {
	fire: ShinTileCodes.Dragon,
	air: ShinTileCodes.SkyBison,
	water: ShinTileCodes.Koi,
	earth: ShinTileCodes.Badgermole
};

function ShinBoard() {
	this.size = new RowAndColumn(17, 17);
	this.cells = this.brandNew();

	this.winners = [];
	this.hostState = this.createPlayerState();
	this.guestState = this.createPlayerState();
}

ShinBoard.prototype.createPlayerState = function() {
	return {
		lotusPlayed: false,
		lionTurtlePlayed: false,
		bondOrder: [],
		activeBondCodes: [],
		lionElement: null
	};
};

ShinBoard.prototype.brandNew = function() {
	var cells = [];

	cells[0] = this.newRow(9, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.mountain(),
		ShinBoardPoint.mountain(),
		ShinBoardPoint.mountain(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[1] = this.newRow(11, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.mountain(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[2] = this.newRow(13, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[3] = this.newRow(15, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[4] = this.newRow(17, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[5] = this.newRow(17, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[6] = this.newRow(17, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[7] = this.newRow(17, [
		ShinBoardPoint.mountain(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.mountain()
	]);

	cells[8] = this.newRow(17, [
		ShinBoardPoint.mountain(),
		ShinBoardPoint.mountain(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.mountain(),
		ShinBoardPoint.mountain()
	]);

	cells[9] = this.newRow(17, [
		ShinBoardPoint.mountain(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.mountain()
	]);

	cells[10] = this.newRow(17, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[11] = this.newRow(17, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[12] = this.newRow(17, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[13] = this.newRow(15, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[14] = this.newRow(13, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.vaatu(),
		ShinBoardPoint.raavaatu(),
		ShinBoardPoint.raava(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[15] = this.newRow(11, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.mountain(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	cells[16] = this.newRow(9, [
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.mountain(),
		ShinBoardPoint.mountain(),
		ShinBoardPoint.mountain(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds(),
		ShinBoardPoint.spiritWilds()
	]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

ShinBoard.prototype.newRow = function(numColumns, points) {
	var cells = [];
	var numBlanksOnSides = (this.size.row - numColumns) / 2;
	var nonPoint = ShinBoardPoint.nonPlayable();

	for (var i = 0; i < this.size.row; i++) {
		if (i < numBlanksOnSides) {
			cells[i] = nonPoint;
		} else if (i < numBlanksOnSides + numColumns) {
			cells[i] = points ? points[i - numBlanksOnSides] : nonPoint;
		} else {
			cells[i] = nonPoint;
		}
	}

	return cells;
};

ShinBoard.prototype.getPlayerState = function(player) {
	return player === GUEST ? this.guestState : this.hostState;
};

ShinBoard.prototype.getOpponent = function(player) {
	return player === HOST ? GUEST : HOST;
};

ShinBoard.prototype.getPointFromNotation = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	return this.cells[point.row][point.col];
};

ShinBoard.prototype.isRaavaTerritory = function(boardPoint) {
	return !!boardPoint
		&& !boardPoint.isType(NON_PLAYABLE)
		&& !boardPoint.isType(SHIN_MOUNTAIN)
		&& (boardPoint.isType(SHIN_RAAVA) || boardPoint.isType(SHIN_RAAVAATU));
};

ShinBoard.prototype.isVaatuTerritory = function(boardPoint) {
	return !!boardPoint
		&& !boardPoint.isType(NON_PLAYABLE)
		&& !boardPoint.isType(SHIN_MOUNTAIN)
		&& (boardPoint.isType(SHIN_VAATU) || boardPoint.isType(SHIN_RAAVAATU));
};

ShinBoard.prototype.isSpiritWilds = function(boardPoint) {
	return !!boardPoint
		&& !boardPoint.isType(NON_PLAYABLE)
		&& !boardPoint.isType(SHIN_MOUNTAIN)
		&& boardPoint.isType(SHIN_SPIRIT_WILDS);
};

ShinBoard.prototype.isPlayable = function(boardPoint) {
	return !!boardPoint
		&& !boardPoint.isType(NON_PLAYABLE)
		&& !boardPoint.isType(SHIN_MOUNTAIN);
};

ShinBoard.prototype.getLotusDeployZoneFromFirstBond = function(player) {
	var playerState = this.getPlayerState(player);

	if (!playerState.bondOrder.length) {
		return null;
	}

	var firstBondCode = playerState.bondOrder[0];

	if (firstBondCode === ShinTileCodes.Rose || firstBondCode === ShinTileCodes.Chrysanthemum) {
		return 'vaatu';
	}

	if (firstBondCode === ShinTileCodes.Jasmine || firstBondCode === ShinTileCodes.Lily) {
		return 'raava';
	}

	return null;
};

ShinBoard.prototype.getMovementProfile = function(tile) {
	if (!tile) {
		return null;
	}

	if (tile.code === ShinTileCodes.Rose
		|| tile.code === ShinTileCodes.Jasmine
		|| tile.code === ShinTileCodes.Lily
		|| tile.code === ShinTileCodes.Chrysanthemum) {
		return { distance: 3, directions: 'orthogonal', canJump: false };
	}

	if (tile.code === ShinTileCodes.Dragon || tile.code === ShinTileCodes.SkyBison) {
		return { distance: 4, directions: 'orthogonal', canJump: true };
	}

	if (tile.code === ShinTileCodes.Koi || tile.code === ShinTileCodes.Badgermole) {
		return { distance: 4, directions: 'diagonal', canJump: false };
	}

	if (tile.code === ShinTileCodes.Lotus) {
		return { distance: 2, directions: 'all', canJump: false };
	}

	if (tile.code === ShinTileCodes.LionTurtle) {
		var playerState = this.getPlayerState(tile.ownerName);

		if (!playerState.lionElement) {
			return { distance: 1, directions: 'all', canJump: false };
		}

		return this.getMovementProfile({ code: SHIN_ELEMENT_TO_MASTER[playerState.lionElement] });
	}

	return null;
};

ShinBoard.prototype.placeTile = function(tile, notationPoint) {
	this.putTileOnPoint(tile, notationPoint);

	if (tile.code === ShinTileCodes.Lotus) {
		this.getPlayerState(tile.ownerName).lotusPlayed = true;
	} else if (tile.code === ShinTileCodes.LionTurtle) {
		this.getPlayerState(tile.ownerName).lionTurtlePlayed = true;
	}

	this.updateDynamicState();
};

ShinBoard.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	point.putTile(tile);
};

ShinBoard.prototype.getSurroundingRowAndCols = function(rowAndCol) {
	var rowAndCols = [];

	for (var row = rowAndCol.row - 1; row <= rowAndCol.row + 1; row++) {
		for (var col = rowAndCol.col - 1; col <= rowAndCol.col + 1; col++) {
			if ((row !== rowAndCol.row || col !== rowAndCol.col)
				&& (row >= 0 && col >= 0)
				&& (row < 17 && col < 17)) {
				var boardPoint = this.cells[row][col];
				if (!boardPoint.isType(NON_PLAYABLE)) {
					rowAndCols.push(new RowAndColumn(row, col));
				}
			}
		}
	}

	return rowAndCols;
};

ShinBoard.prototype.getAdjacentRowAndCols = function(rowAndCol) {
	var rowAndCols = [];

	if (rowAndCol.row > 0) {
		rowAndCols.push(this.cells[rowAndCol.row - 1][rowAndCol.col]);
	}
	if (rowAndCol.row < 16) {
		rowAndCols.push(this.cells[rowAndCol.row + 1][rowAndCol.col]);
	}
	if (rowAndCol.col > 0) {
		rowAndCols.push(this.cells[rowAndCol.row][rowAndCol.col - 1]);
	}
	if (rowAndCol.col < 16) {
		rowAndCols.push(this.cells[rowAndCol.row][rowAndCol.col + 1]);
	}

	return rowAndCols;
};

ShinBoard.prototype.moveTile = function(player, notationPointStart, notationPointEnd) {
	var startRowCol = notationPointStart.rowAndColumn;
	var endRowCol = notationPointEnd.rowAndColumn;

	if (startRowCol.row < 0 || startRowCol.row > 16 || endRowCol.row < 0 || endRowCol.row > 16) {
		debug("That point does not exist. So it's not gonna happen.");
		return false;
	}

	var boardPointStart = this.cells[startRowCol.row][startRowCol.col];
	var boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

	if (!this.canMoveTileToPoint(player, boardPointStart, boardPointEnd)) {
		debug("Bad move bears");
		showBadMoveModal();
		return false;
	}

	var movedTile = boardPointStart.removeTile();
	var capturedTile = null;

	if (boardPointEnd.hasTile()) {
		capturedTile = boardPointEnd.removeTile();
	}

	boardPointEnd.putTile(movedTile);
	this.updateDynamicState();

	return {
		movedTile: movedTile,
		startPoint: boardPointStart,
		endPoint: boardPointEnd,
		capturedTile: capturedTile
	};
};

ShinBoard.prototype.updateDynamicState = function() {
	this.updateBonds();
	this.updateWinners();
};

ShinBoard.prototype.updateBonds = function() {
	var players = [HOST, GUEST];

	for (var p = 0; p < players.length; p++) {
		var player = players[p];
		var state = this.getPlayerState(player);
		var activeBondCodes = [];
		var flowerCodes = [
			ShinTileCodes.Rose,
			ShinTileCodes.Jasmine,
			ShinTileCodes.Lily,
			ShinTileCodes.Chrysanthemum
		];

		for (var i = 0; i < flowerCodes.length; i++) {
			var flowerCode = flowerCodes[i];

			if (this.isBondActive(player, flowerCode)) {
				activeBondCodes.push(flowerCode);

				if (state.bondOrder.indexOf(flowerCode) < 0) {
					state.bondOrder.push(flowerCode);
				}
			}
		}

		state.activeBondCodes = state.bondOrder.filter(function(bondCode) {
			return activeBondCodes.indexOf(bondCode) >= 0;
		});
		state.lionElement = state.activeBondCodes.length ? SHIN_BOND_TO_ELEMENT[state.activeBondCodes[0]] : null;
	}
};

ShinBoard.prototype.updateWinners = function() {
	this.winners = [];
	this.stalemateDraw = false;
	var players = [HOST, GUEST];

	for (var p = 0; p < players.length; p++) {
		var player = players[p];
		var lionTurtlePoint = this.findTilePoint(player, ShinTileCodes.LionTurtle);
		var opponentLotusPoint = this.findTilePoint(this.getOpponent(player), ShinTileCodes.Lotus);
		var playerState = this.getPlayerState(player);

		if (!lionTurtlePoint || !opponentLotusPoint || !playerState.lionElement) {
			continue;
		}

		var adjacentPoints = this.getAdjacentRowAndCols(new RowAndColumn(lionTurtlePoint.row, lionTurtlePoint.col));

		for (var i = 0; i < adjacentPoints.length; i++) {
			if (adjacentPoints[i].row === opponentLotusPoint.row && adjacentPoints[i].col === opponentLotusPoint.col) {
				this.winners.push(player);
				break;
			}
		}
	}

	if (this.winners.length === 0) {
		this.stalemateDraw = this.checkLionTurtleStalemate();
	}
};

ShinBoard.prototype.checkLionTurtleStalemate = function() {
	var hostLT = this.findTilePoint(HOST, ShinTileCodes.LionTurtle);
	var guestLT = this.findTilePoint(GUEST, ShinTileCodes.LionTurtle);

	if (!hostLT || !guestLT) return false;

	var hostState = this.getPlayerState(HOST);
	var guestState = this.getPlayerState(GUEST);

	if (!hostState.lionElement || !guestState.lionElement) return false;

	var hostCanMove = this.lionTurtleHasMoves(HOST, hostLT);
	var guestCanMove = this.lionTurtleHasMoves(GUEST, guestLT);

	return !hostCanMove && !guestCanMove;
};

ShinBoard.prototype.lionTurtleHasMoves = function(player, lionTurtlePoint) {
	var profile = this.getMovementProfile(lionTurtlePoint.tile);
	if (!profile) return false;

	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			if (row === lionTurtlePoint.row && col === lionTurtlePoint.col) continue;
			if (this.canMoveTileToPoint(player, lionTurtlePoint, this.cells[row][col])) {
				return true;
			}
		}
	}
	return false;
};

ShinBoard.prototype.isBondActive = function(player, flowerCode) {
	var flowerPoint = this.findTilePoint(player, flowerCode);
	var masterPoint = this.findTilePoint(player, SHIN_FLOWER_TO_MASTER[flowerCode]);

	if (!flowerPoint || !masterPoint) {
		return false;
	}

	var rowDiff = Math.abs(flowerPoint.row - masterPoint.row);
	var colDiff = Math.abs(flowerPoint.col - masterPoint.col);
	return (rowDiff + colDiff) === 1;
};

ShinBoard.prototype.findTilePoint = function(player, tileCode) {
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var boardPoint = this.cells[row][col];

			if (boardPoint.hasTile()
				&& boardPoint.tile.ownerName === player
				&& boardPoint.tile.code === tileCode) {
				return boardPoint;
			}
		}
	}

	return null;
};

ShinBoard.prototype.allFlowerTilesPlayed = function(player) {
	var flowerCodes = [
		ShinTileCodes.Rose,
		ShinTileCodes.Jasmine,
		ShinTileCodes.Lily,
		ShinTileCodes.Chrysanthemum
	];

	for (var i = 0; i < flowerCodes.length; i++) {
		if (!this.findTilePoint(player, flowerCodes[i])) {
			return false;
		}
	}

	return true;
};

ShinBoard.prototype.allMasterTilesPlayed = function(player) {
	var masterCodes = [
		ShinTileCodes.Dragon,
		ShinTileCodes.SkyBison,
		ShinTileCodes.Koi,
		ShinTileCodes.Badgermole
	];

	for (var i = 0; i < masterCodes.length; i++) {
		if (!this.findTilePoint(player, masterCodes[i])) {
			return false;
		}
	}

	return true;
};

ShinBoard.prototype.getForcedDeployTileCode = function(player) {
	var playerState = this.getPlayerState(player);
	var opponentState = this.getPlayerState(this.getOpponent(player));

	if (!playerState.lotusPlayed
		&& playerState.bondOrder.length
		&& (this.allFlowerTilesPlayed(player) || (opponentState.lotusPlayed && playerState.lionElement))) {
		return ShinTileCodes.Lotus;
	}

	if (!playerState.lionTurtlePlayed && this.allMasterTilesPlayed(player)) {
		return ShinTileCodes.LionTurtle;
	}

	return null;
};

ShinBoard.prototype.canDeployTileToPoint = function(player, tile, notationPoint) {
	if (!tile) {
		return false;
	}

	var boardPoint = this.getPointFromNotation(notationPoint);

	if (!this.isPlayable(boardPoint) || boardPoint.hasTile()) {
		return false;
	}

	var forcedTileCode = this.getForcedDeployTileCode(player);
	if (forcedTileCode && tile.code !== forcedTileCode) {
		return false;
	}

	if (tile.code === ShinTileCodes.Jasmine || tile.code === ShinTileCodes.Lily) {
		return this.isRaavaTerritory(boardPoint);
	}

	if (tile.code === ShinTileCodes.Rose || tile.code === ShinTileCodes.Chrysanthemum) {
		return this.isVaatuTerritory(boardPoint);
	}

	if (tile.code === ShinTileCodes.SkyBison || tile.code === ShinTileCodes.Koi) {
		return this.isRaavaTerritory(boardPoint);
	}

	if (tile.code === ShinTileCodes.Dragon || tile.code === ShinTileCodes.Badgermole) {
		return this.isVaatuTerritory(boardPoint);
	}

	if (tile.code === ShinTileCodes.LionTurtle) {
		return this.isSpiritWilds(boardPoint);
	}

	if (tile.code === ShinTileCodes.Lotus) {
		var lotusDeployZone = this.getLotusDeployZoneFromFirstBond(player);

		if (!lotusDeployZone) {
			return false;
		}

		return lotusDeployZone === 'raava'
			? this.isRaavaTerritory(boardPoint)
			: this.isVaatuTerritory(boardPoint);
	}

	return false;
};

ShinBoard.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	var movingTile = boardPointStart.tile;
	var targetTile = boardPointEnd.tile;

	if (!targetTile || movingTile.ownerName === targetTile.ownerName) {
		return false;
	}

	var movingState = this.getPlayerState(movingTile.ownerName);
	var targetState = this.getPlayerState(targetTile.ownerName);

	if (!movingState.lotusPlayed || !targetState.lotusPlayed) {
		return false;
	}

	if (movingTile.code === ShinTileCodes.LionTurtle) {
		return targetTile.isMasterTile();
	}

	if (movingTile.isMasterTile()) {
		return targetTile.isFlowerTile();
	}

	return false;
};

ShinBoard.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd) {
	if (!boardPointStart.hasTile()) {
		return false;
	}

	if (boardPointStart.tile.ownerName !== player) {
		return false;
	}

	if (!this.isPlayable(boardPointEnd)) {
		return false;
	}

	if (boardPointStart.row === boardPointEnd.row && boardPointStart.col === boardPointEnd.col) {
		return false;
	}

	var profile = this.getMovementProfile(boardPointStart.tile);

	if (!profile) {
		return false;
	}

	if (boardPointEnd.hasTile() && !this.canCapture(boardPointStart, boardPointEnd)) {
		return false;
	}

	if (profile.canJump) {
		return this.canReachByJump(boardPointStart, boardPointEnd, profile);
	}

	if (profile.directions === 'all') {
		return this.canReachAllNoJump(boardPointStart, boardPointEnd, profile);
	}

	return this.canReachWithoutJump(boardPointStart, boardPointEnd, profile);
};

ShinBoard.prototype.canReachByJump = function(boardPointStart, boardPointEnd, profile) {
	var rowDelta = boardPointEnd.row - boardPointStart.row;
	var colDelta = boardPointEnd.col - boardPointStart.col;

	if (profile.directions === 'orthogonal') {
		return Math.abs(rowDelta) + Math.abs(colDelta) <= profile.distance
			&& (rowDelta === 0 || colDelta === 0);
	}

	if (profile.directions === 'diagonal') {
		return Math.abs(rowDelta) === Math.abs(colDelta)
			&& Math.abs(rowDelta) <= profile.distance;
	}

	return Math.abs(rowDelta) + Math.abs(colDelta) <= profile.distance;
};

ShinBoard.prototype.canReachWithoutJump = function(boardPointStart, boardPointEnd, profile) {
	var rowDelta = boardPointEnd.row - boardPointStart.row;
	var colDelta = boardPointEnd.col - boardPointStart.col;

	if (profile.directions === 'orthogonal') {
		if (rowDelta !== 0 && colDelta !== 0) {
			return false;
		}
		if (Math.abs(rowDelta) + Math.abs(colDelta) > profile.distance) {
			return false;
		}
	} else if (profile.directions === 'diagonal') {
		if (Math.abs(rowDelta) !== Math.abs(colDelta)) {
			return false;
		}
		if (Math.abs(rowDelta) > profile.distance) {
			return false;
		}
	} else {
		if (rowDelta !== 0 && colDelta !== 0 && Math.abs(rowDelta) !== Math.abs(colDelta)) {
			return false;
		}
		if (Math.max(Math.abs(rowDelta), Math.abs(colDelta)) > profile.distance) {
			return false;
		}
	}

	var rowStep = rowDelta === 0 ? 0 : (rowDelta > 0 ? 1 : -1);
	var colStep = colDelta === 0 ? 0 : (colDelta > 0 ? 1 : -1);
	var currentRow = boardPointStart.row + rowStep;
	var currentCol = boardPointStart.col + colStep;

	while (currentRow !== boardPointEnd.row || currentCol !== boardPointEnd.col) {
		var intermediatePoint = this.cells[currentRow][currentCol];
		if (!this.isPlayable(intermediatePoint) || intermediatePoint.hasTile()) {
			return false;
		}
		currentRow += rowStep;
		currentCol += colStep;
	}

	return true;
};

ShinBoard.prototype.canReachAllNoJump = function(boardPointStart, boardPointEnd, profile) {
	var rowDelta = Math.abs(boardPointEnd.row - boardPointStart.row);
	var colDelta = Math.abs(boardPointEnd.col - boardPointStart.col);

	if (rowDelta + colDelta > profile.distance) {
		return false;
	}

	var visited = {};
	return this.searchPathManhattan(boardPointStart, boardPointEnd, profile.distance, visited);
};

ShinBoard.prototype.searchPathManhattan = function(currentPoint, targetPoint, movesRemaining, visited) {
	var visitKey = currentPoint.row + ',' + currentPoint.col + ',' + movesRemaining;

	if (visited[visitKey]) {
		return false;
	}
	visited[visitKey] = true;

	if (currentPoint.row === targetPoint.row && currentPoint.col === targetPoint.col) {
		return true;
	}

	if (movesRemaining <= 0) {
		return false;
	}

	var deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];

	for (var i = 0; i < deltas.length; i++) {
		var newRow = currentPoint.row + deltas[i][0];
		var newCol = currentPoint.col + deltas[i][1];

		if (newRow < 0 || newRow >= 17 || newCol < 0 || newCol >= 17) {
			continue;
		}

		var nextPoint = this.cells[newRow][newCol];
		var isTarget = nextPoint.row === targetPoint.row && nextPoint.col === targetPoint.col;

		if (!this.isPlayable(nextPoint)) {
			continue;
		}

		if (nextPoint.hasTile() && !isTarget) {
			continue;
		}

		if (this.searchPathManhattan(nextPoint, targetPoint, movesRemaining - 1, visited)) {
			return true;
		}
	}

	return false;
};

ShinBoard.prototype.getNeighborsByMovement = function(boardPoint, directions) {
	var deltas = [];

	if (directions === 'orthogonal' || directions === 'all') {
		deltas = deltas.concat([
			[-1, 0],
			[1, 0],
			[0, -1],
			[0, 1]
		]);
	}

	if (directions === 'diagonal' || directions === 'all') {
		deltas = deltas.concat([
			[-1, -1],
			[-1, 1],
			[1, -1],
			[1, 1]
		]);
	}

	var points = [];

	for (var i = 0; i < deltas.length; i++) {
		var row = boardPoint.row + deltas[i][0];
		var col = boardPoint.col + deltas[i][1];

		if (row >= 0 && row < 17 && col >= 0 && col < 17) {
			points.push(this.cells[row][col]);
		}
	}

	return points;
};

ShinBoard.prototype.setPossibleMovePoints = function(boardPointStart) {
	if (!boardPointStart.hasTile()) {
		return;
	}

	var player = boardPointStart.tile.ownerName;

	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var boardPoint = this.cells[row][col];

			if (this.canMoveTileToPoint(player, boardPointStart, boardPoint)) {
				boardPoint.addType(POSSIBLE_MOVE);
			}
		}
	}
};

ShinBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

ShinBoard.prototype.setDeployPointsPossibleMoves = function(player, tileCode, tileManager) {
	var tile = tileManager ? tileManager.peekTile(player, tileCode) : { code: tileCode, ownerName: player };
	var self = this;

	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE) && !boardPoint.isType(SHIN_MOUNTAIN)) {
				var notationPoint = {
					rowAndColumn: {
						row: boardPoint.row,
						col: boardPoint.col
					}
				};

				if (self.canDeployTileToPoint(player, tile, notationPoint)) {
					boardPoint.addType(POSSIBLE_MOVE);
				}
			}
		});
	});
};

ShinBoard.prototype.getCopy = function() {
	var copyBoard = new ShinBoard();

	copyBoard.cells = copyArray(this.cells);
	copyBoard.winners = copyArray(this.winners);
	copyBoard.hostState = {
		lotusPlayed: this.hostState.lotusPlayed,
		lionTurtlePlayed: this.hostState.lionTurtlePlayed,
		bondOrder: copyArray(this.hostState.bondOrder),
		activeBondCodes: copyArray(this.hostState.activeBondCodes),
		lionElement: this.hostState.lionElement
	};
	copyBoard.guestState = {
		lotusPlayed: this.guestState.lotusPlayed,
		lionTurtlePlayed: this.guestState.lionTurtlePlayed,
		bondOrder: copyArray(this.guestState.bondOrder),
		activeBondCodes: copyArray(this.guestState.activeBondCodes),
		lionElement: this.guestState.lionElement
	};

	return copyBoard;
};
