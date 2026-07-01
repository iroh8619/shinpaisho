// Shin Game Manager

function ShinGameManager(actuator, ignoreActuate, isCopy) {
	this.gameLogText = '';
	this.isCopy = isCopy;
	this.actuator = actuator;
	this.tileManager = new ShinTileManager();
	this.markingManager = new PaiShoMarkingManager();

	this.setup(ignoreActuate);
}

ShinGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new ShinBoard();

	if (!ignoreActuate) {
		this.actuate();
	}
};

ShinGameManager.prototype.actuate = function(moveToAnimate) {
	if (this.isCopy || !this.actuator) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate);
	setGameLogText(this.gameLogText);
};

ShinGameManager.prototype.runNotationMove = function(move, withActuate) {
	if (!move || !move.fullMoveText) {
		debug("No move?");
		return false;
	}

	if (move.moveType === DEPLOY) {
		var tile = this.tileManager.peekTile(move.player, move.tileType);
		if (!this.board.canDeployTileToPoint(move.player, tile, move.endPoint)) {
			return false;
		}

		tile = this.tileManager.grabTile(move.player, move.tileType);
		this.board.placeTile(tile, move.endPoint);
		this.buildDeployGameLogText(move, tile);
	} else if (move.moveType === MOVE) {
		var moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint);
		if (!moveDetails) {
			return false;
		}

		move.capturedTile = moveDetails.capturedTile;
		if (moveDetails.capturedTile) {
			if (moveDetails.capturedTile.isLionTurtle()) {
				this.tileManager.putTileBack(moveDetails.capturedTile);
				this.board.getPlayerState(moveDetails.capturedTile.ownerName).lionTurtlePlayed = false;
			} else {
				this.tileManager.capturedTiles.push(moveDetails.capturedTile);
			}
		}
		this.buildMoveGameLogText(move, moveDetails);
	}

	if (move.moveType === DRAW_ACCEPT) {
		this.gameHasEndedInDraw = true;
		this.buildAcceptDrawGameLogText(move);
	}

	if (withActuate !== false) {
		this.actuate(move);
	}

	this.lastPlayerName = move.player;
	return true;
};

ShinGameManager.prototype.buildDeployGameLogText = function(move, tile) {
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ move.player + ' deployed ' + ShinTile.getTileName(tile.code) + ' at ' + move.endPoint.pointText
		+ this.getPlayerHasOfferedDrawGameLogTextIfDrawOffered(move);
};

ShinGameManager.prototype.buildMoveGameLogText = function(move, moveDetails) {
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ move.player + ' moved ' + ShinTile.getTileName(moveDetails.movedTile.code)
		+ ' from ' + move.startPoint.pointText + ' to ' + move.endPoint.pointText;

	if (moveDetails.capturedTile) {
		this.gameLogText += ' and captured ' + getOpponentName(move.player) + '\'s '
			+ ShinTile.getTileName(moveDetails.capturedTile.code);
	}

	this.gameLogText += this.getPlayerHasOfferedDrawGameLogTextIfDrawOffered(move);
};

ShinGameManager.prototype.buildAcceptDrawGameLogText = function(move) {
	this.gameLogText = move.moveNum + move.playerCode + '. Draw offer accepted. Game has ended in a draw.';
};

ShinGameManager.prototype.getPlayerHasOfferedDrawGameLogTextIfDrawOffered = function(move) {
	return move.offerDraw ? '. A draw has been offered.' : '';
};

ShinGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

ShinGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}

	this.board.setPossibleMovePoints(boardPoint);

	if (!ignoreActuate) {
		this.actuate();
	}
};

ShinGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();

	if (!ignoreActuate) {
		this.actuate();
	}
};

ShinGameManager.prototype.revealDeployPoints = function(player, tileCode, ignoreActuate) {
	this.board.setDeployPointsPossibleMoves(player, tileCode, this.tileManager);

	if (!ignoreActuate) {
		this.actuate();
	}
};

ShinGameManager.prototype.getWinner = function() {
	if (this.board.winners.length === 1) {
		return this.board.winners[0];
	}
};

ShinGameManager.prototype.getWinReason = function() {
	return ' has moved an Elemental Lion Turtle adjacent to the opponent\'s Lotus and won the game!';
};

ShinGameManager.prototype.getWinResultTypeCode = function() {
	if (this.board.winners.length === 1) {
		return 1;
	}
	if (this.gameHasEndedInDraw || this.board.stalemateDraw) {
		return 4;
	}
};

ShinGameManager.prototype.getNextPlayerName = function() {
	return this.lastPlayerName === HOST ? GUEST : HOST;
};

ShinGameManager.prototype.getCopy = function() {
	var copyGame = new ShinGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	copyGame.lastPlayerName = this.lastPlayerName;
	copyGame.gameHasEndedInDraw = this.gameHasEndedInDraw;
	return copyGame;
};
