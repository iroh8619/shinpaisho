// Shin Pai Sho AI

function ShinAI() {
	this.maxDepth = 3;
	this.player = GUEST;
	this.moveHistory = [];
	this.deployHistory = [];
}

ShinAI.prototype.getName = function() {
	return "Shin AI";
};

ShinAI.prototype.getMessage = function() {
	return "The Lion Turtle grants wisdom to those who seek it.";
};

ShinAI.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

ShinAI.prototype.getOpponent = function() {
	return this.player === HOST ? GUEST : HOST;
};

// --- Entry Point ---

ShinAI.prototype.getMove = function(game, moveNum) {
	this.moveNum = moveNum;
	var allMoves = this.getAllLegalMoves(game, this.player);
	if (allMoves.length === 0) return null;
	if (allMoves.length === 1) return allMoves[0];

	// Pre-score and keep only the best candidates
	var candidates = this.selectCandidates(game, allMoves);

	var bestMove = candidates[0];
	var bestScore = -Infinity;
	var alpha = -Infinity;
	var beta = Infinity;

	for (var i = 0; i < candidates.length; i++) {
		var copy = game.getCopy();
		if (!copy.runNotationMove(candidates[i], false)) continue;

		var score = this.minimax(copy, this.maxDepth - 1, alpha, beta, false);

		// Penalize repetition
		var key = this.getMoveKey(candidates[i]);
		for (var h = 0; h < this.moveHistory.length; h++) {
			if (this.moveHistory[h] === key) score -= 300;
		}

		if (score > bestScore) {
			bestScore = score;
			bestMove = candidates[i];
		}
		if (score >= 90000) break;
		alpha = Math.max(alpha, score);
	}

	this.moveHistory.push(this.getMoveKey(bestMove));
	if (this.moveHistory.length > 6) this.moveHistory.shift();

	if (bestMove.moveType === DEPLOY && bestMove.endPoint) {
		var rc = bestMove.endPoint.rowAndColumn;
		this.deployHistory.push(bestMove.tileType + ':' + rc.row + ',' + rc.col);
		if (this.deployHistory.length > 20) this.deployHistory.shift();
	}

	return bestMove;
};

ShinAI.prototype.getMoveKey = function(move) {
	if (move.moveType === MOVE && move.startPoint && move.endPoint) {
		return move.startPoint.pointText + '>' + move.endPoint.pointText;
	}
	return move.fullMoveText;
};

// --- Candidate Selection (the key to speed + intelligence) ---

ShinAI.prototype.selectCandidates = function(game, moves) {
	var self = this;
	var scored = [];

	for (var i = 0; i < moves.length; i++) {
		var base = self.strategicScore(game, moves[i]);
		// Add controlled randomness so it doesn't always pick the same spot
		var noise = Math.floor(Math.random() * 40) - 20;
		scored.push({ move: moves[i], s: base + noise });
	}

	scored.sort(function(a, b) { return b.s - a.s; });

	var result = [];
	var limit = Math.min(scored.length, 12);
	for (var j = 0; j < limit; j++) {
		result.push(scored[j].move);
	}
	return result;
};

ShinAI.prototype.strategicScore = function(game, move) {
	var board = game.board;
	var me = this.player;
	var s = 0;

	if (move.moveType === DEPLOY) {
		s += this.scoreDeployMove(game, move);
	} else if (move.moveType === MOVE) {
		s += this.scoreMoveMove(game, move);
	}

	return s;
};

ShinAI.prototype.scoreDeployMove = function(game, move) {
	var board = game.board;
	var me = this.player;
	var s = 0;
	var endRC = move.endPoint.rowAndColumn;

	// Penalize deploying to same spots as previous games
	var deployKey = move.tileType + ':' + endRC.row + ',' + endRC.col;
	for (var dh = 0; dh < this.deployHistory.length; dh++) {
		if (this.deployHistory[dh] === deployKey) s -= 150;
	}

	// Forced deploys are top priority
	var forced = board.getForcedDeployTileCode(me);
	if (forced && move.tileType === forced) s += 500;

	// --- Pair-based deployment: deploy near matching partner ---
	var partnerCode = null;
	var iAmFlower = false;
	var pairs = {R:'D', D:'R', J:'S', S:'J', I:'K', K:'I', C:'B', B:'C'};
	partnerCode = pairs[move.tileType];

	if (partnerCode) {
		var partnerPoint = board.findTilePoint(me, partnerCode);
		if (partnerPoint) {
			var dist = Math.abs(endRC.row - partnerPoint.row) + Math.abs(endRC.col - partnerPoint.col);
			if (dist === 1) {
				s += 200; // Immediate bond!
			} else if (dist <= 3) {
				s += (4 - dist) * 40;
			}
		} else {
			// Partner not yet on board - deploy near center for flexibility
			var centerDist = Math.abs(endRC.row - 8) + Math.abs(endRC.col - 8);
			s += Math.max(0, (8 - centerDist) * 8);
		}
	}

	// Lion Turtle: only deploy when you have an element, and near opponent Lotus
	if (move.tileType === ShinTileCodes.LionTurtle) {
		var myState = board.getPlayerState(me);
		if (!myState.lionElement) {
			s -= 200; // Don't deploy without an element, it's useless
		} else {
			s += 100;
			var oppLotus = board.findTilePoint(this.getOpponent(), ShinTileCodes.Lotus);
			if (oppLotus) {
				var ltDist = Math.max(Math.abs(endRC.row - oppLotus.row), Math.abs(endRC.col - oppLotus.col));
				s += (10 - ltDist) * 20;
			}
		}
	}

	// Lotus: deploy after first bond, away from opponent Lion Turtle
	if (move.tileType === ShinTileCodes.Lotus) {
		s += 80;
		var oppLT = board.findTilePoint(this.getOpponent(), ShinTileCodes.LionTurtle);
		if (oppLT) {
			var lotusDist = Math.max(Math.abs(endRC.row - oppLT.row), Math.abs(endRC.col - oppLT.col));
			s += lotusDist * 15;
		}
	}

	// Prioritize flowers and masters early to build bonds
	if ([ShinTileCodes.Dragon, ShinTileCodes.SkyBison, ShinTileCodes.Koi, ShinTileCodes.Badgermole].indexOf(move.tileType) >= 0) {
		s += 60;
	}
	if ([ShinTileCodes.Rose, ShinTileCodes.Jasmine, ShinTileCodes.Lily, ShinTileCodes.Chrysanthemum].indexOf(move.tileType) >= 0) {
		s += 50;
	}

	return s;
};

ShinAI.prototype.scoreMoveMove = function(game, move) {
	var board = game.board;
	var me = this.player;
	var opp = this.getOpponent();
	var s = 0;

	if (!move.startPoint || !move.endPoint) return 0;

	var startRC = move.startPoint.rowAndColumn;
	var endRC = move.endPoint.rowAndColumn;
	var startBp = board.cells[startRC.row][startRC.col];
	var endBp = board.cells[endRC.row][endRC.col];

	if (!startBp.hasTile()) return 0;
	var movingTile = startBp.tile;

	// --- Captures are very valuable ---
	if (endBp.hasTile() && endBp.tile.ownerName === opp) {
		s += 800;
		if (endBp.tile.isLionTurtle()) s += 1500; // Removes opponent's only win condition
		if (endBp.tile.isMasterTile()) s += 400; // Breaking bonds
		if (endBp.tile.isFlowerTile()) s += 200;
	}

	// --- Lion Turtle approaching opponent Lotus ---
	if (movingTile.isLionTurtle()) {
		var myState = board.getPlayerState(me);
		if (myState.lionElement) {
			var oppLotus = board.findTilePoint(opp, ShinTileCodes.Lotus);
			if (oppLotus) {
				var oldDist = Math.max(Math.abs(startRC.row - oppLotus.row), Math.abs(startRC.col - oppLotus.col));
				var newDist = Math.max(Math.abs(endRC.row - oppLotus.row), Math.abs(endRC.col - oppLotus.col));
				if (newDist < oldDist) {
					s += (oldDist - newDist) * 150;
				}
				if (newDist === 1) s += 500; // Adjacent = about to win
			}
		}
		s += 100;
	}

	// --- Move flower/master to form a bond ---
	if (movingTile.isFlowerTile() || movingTile.isMasterTile()) {
		var partnerCode2 = {R:'D',D:'R',J:'S',S:'J',I:'K',K:'I',C:'B',B:'C'}[movingTile.code];
		if (partnerCode2) {
			var partner = board.findTilePoint(me, partnerCode2);
			if (partner) {
				var oldPartnerDist = Math.abs(startRC.row - partner.row) + Math.abs(startRC.col - partner.col);
				var newPartnerDist = Math.abs(endRC.row - partner.row) + Math.abs(endRC.col - partner.col);
				if (newPartnerDist === 1 && oldPartnerDist > 1) {
					s += 250; // Creating a bond
				} else if (newPartnerDist < oldPartnerDist) {
					s += (oldPartnerDist - newPartnerDist) * 30;
				}
			}
		}
	}

	// --- Lotus: move away from opponent Lion Turtle ---
	if (movingTile.isLotus()) {
		var oppLT2 = board.findTilePoint(opp, ShinTileCodes.LionTurtle);
		if (oppLT2) {
			var oppState = board.getPlayerState(opp);
			if (oppState.lionElement) {
				var oldThreat = Math.max(Math.abs(startRC.row - oppLT2.row), Math.abs(startRC.col - oppLT2.col));
				var newThreat = Math.max(Math.abs(endRC.row - oppLT2.row), Math.abs(endRC.col - oppLT2.col));
				if (newThreat > oldThreat) {
					s += (newThreat - oldThreat) * 100;
				}
			}
		}
	}

	return s;
};

// --- Minimax ---

ShinAI.prototype.minimax = function(game, depth, alpha, beta, isMaximizing) {
	if (depth <= 0 || game.hasEnded()) return this.evaluate(game);

	var currentPlayer = isMaximizing ? this.player : this.getOpponent();
	var moves = this.getAllLegalMoves(game, currentPlayer);
	if (moves.length === 0) return this.evaluate(game);

	var candidates = this.selectCandidates(game, moves);
	var limit = Math.min(candidates.length, 10);

	if (isMaximizing) {
		var best = -Infinity;
		for (var i = 0; i < limit; i++) {
			var copy = game.getCopy();
			if (!copy.runNotationMove(candidates[i], false)) continue;
			var s = this.minimax(copy, depth - 1, alpha, beta, false);
			if (s > best) best = s;
			if (s > alpha) alpha = s;
			if (beta <= alpha) break;
		}
		return best;
	} else {
		var best = Infinity;
		for (var i = 0; i < limit; i++) {
			var copy = game.getCopy();
			if (!copy.runNotationMove(candidates[i], false)) continue;
			var s = this.minimax(copy, depth - 1, alpha, beta, true);
			if (s < best) best = s;
			if (s < beta) beta = s;
			if (beta <= alpha) break;
		}
		return best;
	}
};

// --- Position Evaluation ---

ShinAI.prototype.evaluate = function(game) {
	var board = game.board;
	var me = this.player;
	var opp = this.getOpponent();

	if (board.winners.indexOf(me) >= 0) return 100000;
	if (board.winners.indexOf(opp) >= 0) return -100000;
	if (game.gameHasEndedInDraw) return 0;

	var score = 0;
	var myState = board.getPlayerState(me);
	var oppState = board.getPlayerState(opp);

	// Material
	var myPieces = this.countPieces(board, me);
	var oppPieces = this.countPieces(board, opp);
	score += (myPieces.flowers - oppPieces.flowers) * 100;
	score += (myPieces.masters - oppPieces.masters) * 160;

	// Bonds
	score += myState.activeBondCodes.length * 90;
	score -= oppState.activeBondCodes.length * 90;

	// Element (critical for winning)
	if (myState.lionElement) score += 200;
	if (oppState.lionElement) score -= 200;

	// Spirit tiles deployed
	if (myState.lotusPlayed) score += 50;
	if (myState.lionTurtlePlayed) score += 60;
	if (oppState.lotusPlayed) score -= 30;
	if (oppState.lionTurtlePlayed) score -= 40;

	// Winning proximity
	var myLT = board.findTilePoint(me, ShinTileCodes.LionTurtle);
	var oppLotus = board.findTilePoint(opp, ShinTileCodes.Lotus);
	if (myLT && oppLotus && myState.lionElement) {
		var d = Math.max(Math.abs(myLT.row - oppLotus.row), Math.abs(myLT.col - oppLotus.col));
		score += (d <= 1) ? 600 : (10 - d) * 45;
	}

	// Defense
	var oppLT = board.findTilePoint(opp, ShinTileCodes.LionTurtle);
	var myLotus = board.findTilePoint(me, ShinTileCodes.Lotus);
	if (oppLT && myLotus && oppState.lionElement) {
		var d2 = Math.max(Math.abs(oppLT.row - myLotus.row), Math.abs(oppLT.col - myLotus.col));
		if (d2 <= 1) score -= 500;
		else if (d2 <= 3) score -= (4 - d2) * 120;
	}

	// Bond proximity (pieces close to forming bonds)
	score += this.bondProximity(board, me) * 15;
	score -= this.bondProximity(board, opp) * 15;

	// Forced deploy pressure
	if (board.getForcedDeployTileCode(opp)) score += 35;
	if (board.getForcedDeployTileCode(me)) score -= 15;

	return score;
};

ShinAI.prototype.countPieces = function(board, player) {
	var f = 0, m = 0;
	for (var r = 0; r < board.cells.length; r++) {
		for (var c = 0; c < board.cells[r].length; c++) {
			var bp = board.cells[r][c];
			if (bp.hasTile() && bp.tile.ownerName === player) {
				if (bp.tile.isFlowerTile()) f++;
				else if (bp.tile.isMasterTile()) m++;
			}
		}
	}
	return { flowers: f, masters: m };
};

ShinAI.prototype.bondProximity = function(board, player) {
	var score = 0;
	var pairs = [
		[ShinTileCodes.Rose, ShinTileCodes.Dragon],
		[ShinTileCodes.Jasmine, ShinTileCodes.SkyBison],
		[ShinTileCodes.Lily, ShinTileCodes.Koi],
		[ShinTileCodes.Chrysanthemum, ShinTileCodes.Badgermole]
	];
	for (var i = 0; i < pairs.length; i++) {
		var fp = board.findTilePoint(player, pairs[i][0]);
		var mp = board.findTilePoint(player, pairs[i][1]);
		if (fp && mp) {
			var dist = Math.abs(fp.row - mp.row) + Math.abs(fp.col - mp.col);
			if (dist === 1) score += 6;
			else if (dist <= 3) score += (4 - dist) * 2;
		}
	}
	return score;
};

// --- Move Generation ---

ShinAI.prototype.getAllLegalMoves = function(game, player) {
	var moves = [];
	this.addDeployMoves(moves, game, player);
	this.addMovementMoves(moves, game, player);
	return moves;
};

ShinAI.prototype.addDeployMoves = function(moves, game, player) {
	var board = game.board;
	var tilePile = game.tileManager.getTilePile(player);
	var forcedTile = board.getForcedDeployTileCode(player);

	var seenCodes = {};
	for (var t = 0; t < tilePile.length; t++) {
		var tile = tilePile[t];
		if (forcedTile && tile.code !== forcedTile) continue;
		if (seenCodes[tile.code]) continue;
		seenCodes[tile.code] = true;

		for (var row = 0; row < board.cells.length; row++) {
			for (var col = 0; col < board.cells[row].length; col++) {
				var bp = board.cells[row][col];
				if (bp.isType(NON_PLAYABLE) || bp.isType(SHIN_MOUNTAIN) || bp.hasTile()) continue;
				var np = { rowAndColumn: { row: row, col: col } };
				if (board.canDeployTileToPoint(player, tile, np)) {
					moves.push(new ShinNotationMove(this.moveNum + player.charAt(0) + '.' + tile.code + '(' + this.ptn(row, col) + ')'));
				}
			}
		}
	}
};

ShinAI.prototype.addMovementMoves = function(moves, game, player) {
	var board = game.board;
	for (var row = 0; row < board.cells.length; row++) {
		for (var col = 0; col < board.cells[row].length; col++) {
			var sbp = board.cells[row][col];
			if (!sbp.hasTile() || sbp.tile.ownerName !== player) continue;
			var profile = board.getMovementProfile(sbp.tile);
			if (!profile) continue;

			var range = profile.distance;
			var rMin = Math.max(0, row - range);
			var rMax = Math.min(16, row + range);
			var cMin = Math.max(0, col - range);
			var cMax = Math.min(16, col + range);

			for (var er = rMin; er <= rMax; er++) {
				for (var ec = cMin; ec <= cMax; ec++) {
					if (er === row && ec === col) continue;
					if (board.canMoveTileToPoint(player, sbp, board.cells[er][ec])) {
						moves.push(new ShinNotationMove(this.moveNum + player.charAt(0) + '.(' + this.ptn(row, col) + ')-(' + this.ptn(er, ec) + ')'));
					}
				}
			}
		}
	}
};

ShinAI.prototype.ptn = function(row, col) {
	return (col - 8) + ',' + (8 - row);
};
