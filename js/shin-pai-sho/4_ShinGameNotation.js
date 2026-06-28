// Shin Notation

function shinNormalizePointText(pointText) {
	if (!pointText) {
		return pointText;
	}

	var normalized = pointText.trim();

	if (normalized.startsWith('(') && normalized.endsWith(')')) {
		normalized = normalized.substring(1, normalized.length - 1);
	}

	return normalized;
}

function ShinNotationMove(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

ShinNotationMove.prototype.analyzeMove = function() {
	this.valid = true;

	var parts = this.fullMoveText.split(".");
	var moveNumAndPlayer = parts[0];

	this.moveNum = parseInt(moveNumAndPlayer.slice(0, -1));
	this.playerCode = moveNumAndPlayer.charAt(moveNumAndPlayer.length - 1);

	if (this.playerCode === 'G') {
		this.player = GUEST;
	} else if (this.playerCode === 'H') {
		this.player = HOST;
	}

	var moveText = parts[1];
	if (!moveText) {
		return;
	}

	var char0 = moveText.charAt(0);
	if (char0 === '(') {
		this.moveType = MOVE;
	} else if (moveText.startsWith(DRAW_ACCEPT)) {
		this.moveType = DRAW_ACCEPT;
	} else {
		this.moveType = DEPLOY;
	}

	if (this.moveType === DEPLOY) {
		this.tileType = char0;

		if (moveText.charAt(1) !== '(') {
			debug("Failure to deploy");
			this.valid = false;
		}

		if (moveText.endsWith(')') || moveText.endsWith(')' + DRAW_OFFER)) {
			var startIndex = moveText.indexOf('(') + 1;
			var endIndex = moveText.lastIndexOf(')');
			var deployPointText = shinNormalizePointText(moveText.substring(startIndex, endIndex));
			this.endPoint = new NotationPoint(deployPointText);
		} else {
			this.valid = false;
		}
	} else if (this.moveType === MOVE) {
		var pointParts = moveText.substring(moveText.indexOf('(') + 1).split(')-(');
		this.startPoint = new NotationPoint(shinNormalizePointText(pointParts[0]));
		this.endPoint = new NotationPoint(
			shinNormalizePointText(pointParts[1].substring(0, pointParts[1].indexOf(')')))
		);
	}

	this.offerDraw = moveText.endsWith(DRAW_OFFER);
};

ShinNotationMove.prototype.isValidNotation = function() {
	return this.valid;
};

ShinNotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};

function ShinNotationBuilder() {
	this.moveType = null;
	this.tileType = null;
	this.endPoint = null;
	this.startPoint = null;
	this.status = BRAND_NEW;
}

ShinNotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	var notationLine = moveNum + player.charAt(0) + '.';

	if (this.moveType === MOVE) {
		notationLine += '(' + shinNormalizePointText(this.startPoint.pointText) + ')-(' + shinNormalizePointText(this.endPoint.pointText) + ')';
	} else if (this.moveType === DEPLOY) {
		notationLine += this.tileType + '(' + shinNormalizePointText(this.endPoint.pointText) + ')';
	} else if (this.moveType === DRAW_ACCEPT) {
		notationLine += DRAW_ACCEPT;
	}

	if (this.offerDraw) {
		notationLine += DRAW_OFFER;
	}

	return new ShinNotationMove(notationLine);
};

function ShinGameNotation() {
	this.notationText = "";
	this.moves = [];
}

ShinGameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

ShinGameNotation.prototype.addNotationLine = function(text) {
	this.notationText += ";" + text.trim();
	this.loadMoves();
};

ShinGameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

ShinGameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

ShinGameNotation.prototype.getPlayerMoveNum = function() {
	var moveNum = 0;
	var lastMove = this.moves[this.moves.length - 1];

	if (lastMove) {
		moveNum = lastMove.moveNum;
		if (lastMove.player === GUEST) {
			moveNum++;
		}
	} else {
		moveNum = 1;
	}

	return moveNum;
};

ShinGameNotation.prototype.getNotationMoveFromBuilder = function(notationBuilder) {
	return notationBuilder.getNotationMove(this.getPlayerMoveNum(), this.getNextPlayer());
};

ShinGameNotation.prototype.getNextPlayer = function() {
	if (this.moves.length === 0) {
		return HOST;
	}

	return this.moves[this.moves.length - 1].player === HOST ? GUEST : HOST;
};

ShinGameNotation.prototype.loadMoves = function() {
	this.moves = [];

	if (!this.notationText) {
		return;
	}

	var lines = this.notationText.split(";");
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i].trim();
		if (!line) {
			continue;
		}
		this.moves.push(new ShinNotationMove(line));
	}
};

ShinGameNotation.prototype.lastMoveHasDrawOffer = function() {
	if (this.moves.length > 0) {
		return this.moves[this.moves.length - 1].offerDraw;
	}
};

ShinGameNotation.prototype.notationTextForUrl = function() {
	return this.notationText;
};

ShinGameNotation.prototype.getNotationHtml = function() {
	var notation = '';

	this.moves.forEach(function(move) {
		if (move.moveNum === 0) {
			return;
		}
		notation += move.fullMoveText + '<br />';
	});

	return notation;
};
