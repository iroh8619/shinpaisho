/* Shin Pai Sho specific UI interaction logic */

var ShinConstants = {
	preferencesKey: "ShinPreferencesKey",
	tileDesignTypeKey: "ShinTileDesignType",
	peekAtOpponentMovesPrefKey: "ShinPeekAtOpponentMoves",
	animationsEnabledKey: "ShinAnimationsEnabled",
	ruleHintsEnabledKey: "ShinRuleHintsEnabled",
	defaultTileDesignKey: "classic"
};

var ShinPreferences = {
	customTilesUrl: ""
};

function ShinController(gameContainer, isMobile) {
	this.peekAtOpponentMovesPrefKey = ShinConstants.peekAtOpponentMovesPrefKey;
	this.promptToAcceptDraw = false;
	this.mouseStartPoint = null;
	this.checkingOutOpponentTileOrNotMyTurn = false;

	ShinController.ensureDefaultPreferences();
	ShinController.loadPreferences();

	this.actuator = new ShinActuator(gameContainer, isMobile, this.isAnimationsEnabled());

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];
	this.isPaiShoGame = true;

	this.completeSetup();
}

ShinController.ensureDefaultPreferences = function() {
	var tileDesignKey = localStorage.getItem(ShinConstants.tileDesignTypeKey);
	if (!tileDesignKey || !ShinController.tileDesignTypeValues[tileDesignKey]) {
		localStorage.setItem(ShinConstants.tileDesignTypeKey, ShinConstants.defaultTileDesignKey);
	}
};

ShinController.loadPreferences = function() {
	var savedPreferences = JSON.parse(localStorage.getItem(ShinConstants.preferencesKey));
	if (savedPreferences) {
		ShinPreferences = {};
		for (var key in ShinPreferences) {
			if (ShinPreferences.hasOwnProperty(key)) {
				ShinPreferences[key] = ShinPreferences[key];
			}
		}
		for (var skey in savedPreferences) {
			if (savedPreferences.hasOwnProperty(skey)) {
				ShinPreferences[skey] = savedPreferences[skey];
			}
		}
	}
};

ShinController.savePreferences = function() {
	localStorage.setItem(ShinConstants.preferencesKey, JSON.stringify(ShinPreferences));
};

ShinController.getResolvedTileDesignKey = function() {
	var designKey = localStorage.getItem(ShinConstants.tileDesignTypeKey);
	if (!designKey || !ShinController.tileDesignTypeValues[designKey]) {
		designKey = ShinConstants.defaultTileDesignKey;
		localStorage.setItem(ShinConstants.tileDesignTypeKey, designKey);
	}
	return designKey;
};

ShinController.getHostTilesContainerDivs = function() {
	return '<div class="HR"></div> <div class="HJ"></div> <div class="HI"></div> <div class="HC"></div> <br class="clear" /> <div class="HD"></div> <div class="HS"></div> <div class="HK"></div> <div class="HB"></div> <br class="clear" /> <div class="HT"></div> <div class="HL"></div>';
};

ShinController.getGuestTilesContainerDivs = function() {
	return '<div class="GR"></div> <div class="GJ"></div> <div class="GI"></div> <div class="GC"></div> <br class="clear" /> <div class="GD"></div> <div class="GS"></div> <div class="GK"></div> <div class="GB"></div> <br class="clear" /> <div class="GT"></div> <div class="GL"></div>';
};

ShinController.setTileDesignsPreference = function(tileDesignKey) {
	if (tileDesignKey === 'custom') {
		promptForCustomTileDesigns(GameType.ShinPaiSho, ShinPreferences.customTilesUrl);
		return;
	}

	localStorage.setItem(ShinConstants.tileDesignTypeKey, tileDesignKey);
	if (gameController && gameController.callActuate) {
		gameController.callActuate();
	}
};

ShinController.isUsingCustomTileDesigns = function() {
	return ShinController.getResolvedTileDesignKey() === "custom";
};

ShinController.getCustomTileDesignsUrl = function() {
	return ShinPreferences.customTilesUrl;
};

ShinController.getTileImageSourceDir = function() {
	if (ShinController.isUsingCustomTileDesigns()) {
		return ShinController.getCustomTileDesignsUrl();
	}
	return "images/Shin/" + ShinController.getResolvedTileDesignKey() + "/";
};

ShinController.buildTileDesignDropdownDiv = function(alternateLabelText) {
	var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv(
		"shinPaiShoTileDesignDropdown",
		labelText + ":",
		ShinController.buildDesignTypeValuesForDropdown(),
		ShinController.getResolvedTileDesignKey(),
		function() {
			ShinController.setTileDesignsPreference(this.value);
		}
	);
};

ShinController.buildDesignTypeValuesForDropdown = function() {
	var designValues = {};
	var keys = Object.keys(ShinController.tileDesignTypeValues);
	for (var i = 0; i < keys.length; i++) {
		designValues[keys[i]] = ShinController.tileDesignTypeValues[keys[i]];
	}
	return designValues;
};

ShinController.tileDesignTypeValues = {
	classic: "Uncle Iroh",
	custom: "Use Custom Designs"
};

ShinController.prototype.getGameTypeId = function() {
	return GameType.ShinPaiSho ? GameType.ShinPaiSho.id : "ShinPaiSho";
};

ShinController.prototype.completeSetup = function() {
	this.peekAtOpponentMoves = getUserGamePreference(this.peekAtOpponentMovesPrefKey) === "true";
};

ShinController.prototype.readyToShowPlayAgainstAiOption = function() {
	return currentMoveIndex === 1;
};

ShinController.prototype.resetGameManager = function() {
	this.theGame = new ShinGameManager(this.actuator);
};

ShinController.prototype.resetNotationBuilder = function(applyDrawOffer) {
	this.notationBuilder = new ShinNotationBuilder();
	if (applyDrawOffer) {
		this.notationBuilder.offerDraw = true;
	}
	this.checkingOutOpponentTileOrNotMyTurn = false;
};

ShinController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

ShinController.prototype.getNewGameNotation = function() {
	return new ShinGameNotation();
};

ShinController.prototype.callActuate = function() {
	this.theGame.actuate();
};

ShinController.prototype.resetMove = function() {
	this.notationBuilder.offerDraw = false;
	if (this.notationBuilder.status === BRAND_NEW) {
		this.gameNotation.removeLastMove();
	}
	rerunAll();
};

ShinController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Shin Pai Sho</h4><p>You win by moving your Elemental Lion Turtle adjacent to your opponent's Lotus.</p><p>On a turn, you may deploy, move, or capture a tile.</p><p>A Flower tile adjacent to its matching Master tile creates a Bond. Your first Bond determines your Lion Turtle's element.</p><p>Captures are only allowed once both Lotuses are on the board. Lion Turtle captures Masters and the opponent's Lion Turtle, Masters capture Flowers. Flowers and Lotus cannot capture. A captured Lion Turtle returns to its owner's reserve.</p><p>Deploy Flowers and Masters in their territory. Lotus and Lion Turtle follow special deployment rules, see the <a href='https://docs.google.com/document/d/1ITusWBfYiYiQq36Kyml_dHGgZVYDu8AbeQTb0b5D7Jc/edit?usp=sharing' target='_blank'>rules PDF</a> for details.</p>";
};

ShinController.prototype.togglePeekAtOpponentMoves = function() {
	this.peekAtOpponentMoves = !this.peekAtOpponentMoves;
	setUserGamePreference(this.peekAtOpponentMovesPrefKey, this.peekAtOpponentMoves);
	clearMessage();
};

ShinController.prototype.getLionTurtleStatusMessage = function() {
	if (!this.isRuleHintsEnabled()) {
		return "";
	}

	var msg = "";
	var hostState = this.theGame.board.getPlayerState(HOST);
	var guestState = this.theGame.board.getPlayerState(GUEST);

	if (hostState.lionElement || guestState.lionElement) {
		msg += "<br />";
		if (hostState.lionElement) {
			msg += "Host Lion Turtle: <strong>" + hostState.lionElement.charAt(0).toUpperCase() + hostState.lionElement.slice(1) + "</strong><br />";
		}
		if (guestState.lionElement) {
			msg += "Guest Lion Turtle: <strong>" + guestState.lionElement.charAt(0).toUpperCase() + guestState.lionElement.slice(1) + "</strong><br />";
		}
	}

	return msg;
};

ShinController.prototype.getAdditionalMessage = function() {
	var msg = "";

	msg += this.getLionTurtleStatusMessage();

	if (this.isRuleHintsEnabled() && this.gameNotation.moves.length > 0 && !this.theGame.hasEnded() && myTurn()) {
		var currentPlayer = this.getCurrentPlayer();
		var opponent = this.theGame.board.getOpponent(currentPlayer);
		var forcedTile = this.theGame.board.getForcedDeployTileCode(currentPlayer);
		if (forcedTile) {
			var tileName = ShinTile.getTileName(forcedTile);
			if (forcedTile === ShinTileCodes.Lotus) {
				if (this.theGame.board.allFlowerTilesPlayed(currentPlayer)) {
					msg += "<br /><strong>All " + currentPlayer + " Flower tiles are on the board. " + currentPlayer + " must deploy the " + tileName + ".</strong><br />";
				} else {
					msg += "<br /><strong>" + opponent + "'s Lotus is on the board and " + currentPlayer + "'s Lion Turtle is elemental. " + currentPlayer + " must deploy the " + tileName + ".</strong><br />";
				}
			} else if (forcedTile === ShinTileCodes.LionTurtle) {
				msg += "<br /><strong>All " + currentPlayer + " Master tiles are on the board. " + currentPlayer + " must deploy the " + tileName + ".</strong><br />";
			}
		}
	}

	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by making a move. <br />";
		} else {
			msg += "Sign in to enable online gameplay. Or, start playing a local game by making a move.";
		}
		msg += getGameOptionsMessageHtml((GameType.ShinPaiSho ? GameType.ShinPaiSho.gameOptions : []));
	} else if (!this.theGame.hasEnded() && myTurn()) {
		if (this.gameNotation.lastMoveHasDrawOffer() && this.promptToAcceptDraw) {
			msg += "<br />Are you sure you want to accept the draw offer and end the game?<br />";
			msg += "<span class='skipBonus' onclick='gameController.confirmAcceptDraw();'>Yes, accept draw and end the game</span>";
			msg += "<br /><br />";
		} else if (this.gameNotation.lastMoveHasDrawOffer()) {
			msg += "<br />Your opponent is offering a draw. You may <span class='skipBonus' onclick='gameController.acceptDraw();'>Accept Draw</span> or make a move to refuse the draw offer.<br />";
		} else if (this.notationBuilder.offerDraw) {
			msg += "<br />Your opponent will be able to accept or reject your draw offer once you make your move. Or, you may <span class='skipBonus' onclick='gameController.removeDrawOffer();'>remove your draw offer</span> from this move.";
		} else {
			msg += "<br /><span class='skipBonus' onclick='gameController.offerDraw();'>Offer Draw</span><br />";
		}
	} else if (!myTurn() && this.gameNotation.lastMoveHasDrawOffer()) {
		msg += "<br />A draw has been offered.<br />";
	}

	return msg;
};

ShinController.prototype.gameHasEndedInDraw = function() {
	return this.theGame.gameHasEndedInDraw || this.theGame.board.stalemateDraw;
};

ShinController.prototype.acceptDraw = function() {
	if (myTurn()) {
		this.promptToAcceptDraw = true;
		refreshMessage();
	}
};

ShinController.prototype.confirmAcceptDraw = function() {
	if (myTurn() && this.gameNotation.lastMoveHasDrawOffer()) {
		this.resetNotationBuilder();
		this.notationBuilder.moveType = DRAW_ACCEPT;

		var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		this.theGame.runNotationMove(move);
		this.gameNotation.addMove(move);

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}
};

ShinController.prototype.offerDraw = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = true;
		refreshMessage();
	}
};

ShinController.prototype.removeDrawOffer = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = false;
		refreshMessage();
	}
};

ShinController.prototype.unplayedTileClicked = function(tileDiv) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	this.promptToAcceptDraw = false;

	if (this.theGame.hasEnded() && this.notationBuilder.status !== READY_FOR_BONUS) {
		return;
	}
	if (!myTurn() && !this.peekAtOpponentMoves) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length && !this.peekAtOpponentMoves) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var divName = tileDiv.getAttribute("name");
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName.substring(1);

	var player = playerCode === 'H' ? HOST : GUEST;
	var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

	if (tile.ownerName !== this.getCurrentPlayer() || !myTurn()) {
		this.checkingOutOpponentTileOrNotMyTurn = true;
		if (!this.peekAtOpponentMoves) {
			return;
		}
	}

	if (this.notationBuilder.status === BRAND_NEW) {
		var forcedTile = this.theGame.board.getForcedDeployTileCode(this.getCurrentPlayer());
		if (forcedTile && tileCode !== forcedTile) {
			return;
		}

		tile.selectedFromPile = true;
		this.notationBuilder.moveType = DEPLOY;
		this.notationBuilder.tileType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;
		this.theGame.revealDeployPoints(tile.ownerName, tileCode);
	} else {
		this.theGame.hidePossibleMovePoints();
		this.resetNotationBuilder(this.notationBuilder.offerDraw);
	}
};

ShinController.prototype.RmbDown = function(htmlPoint) {
	var notationPoint = new NotationPoint(htmlPoint.getAttribute("name"));
	var rowCol = notationPoint.rowAndColumn;
	this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
};

ShinController.prototype.RmbUp = function(htmlPoint) {
	var notationPoint = new NotationPoint(htmlPoint.getAttribute("name"));
	var rowCol = notationPoint.rowAndColumn;
	var mouseEndPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (mouseEndPoint === this.mouseStartPoint) {
		this.theGame.markingManager.toggleMarkedPoint(mouseEndPoint);
	} else if (this.mouseStartPoint) {
		this.theGame.markingManager.toggleMarkedArrow(this.mouseStartPoint, mouseEndPoint);
	}
	this.mouseStartPoint = null;
	this.callActuate();
};

ShinController.prototype.pointClicked = function(htmlPoint) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	this.promptToAcceptDraw = false;

	if (this.theGame.hasEnded()) {
		return;
	}
	if (!myTurn() && !this.peekAtOpponentMoves) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length && !this.peekAtOpponentMoves) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var notationPoint = new NotationPoint(htmlPoint.getAttribute("name"));
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (this.notationBuilder.status === BRAND_NEW) {
		var forcedTile = this.theGame.board.getForcedDeployTileCode(this.getCurrentPlayer());
		if (forcedTile && myTurn()) {
			return;
		}

		if (!boardPoint.hasTile()) {
			return;
		}
		if (boardPoint.tile.ownerName !== this.getCurrentPlayer() || !myTurn()) {
			debug("That's not your tile!");
			this.checkingOutOpponentTileOrNotMyTurn = true;
			if (!this.peekAtOpponentMoves) {
				return;
			}
		}
		if (!boardPoint.tile.canMove()) {
			return;
		}

		this.notationBuilder.status = WAITING_FOR_ENDPOINT;
		this.notationBuilder.moveType = MOVE;
		this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));
		this.theGame.revealPossibleMovePoints(boardPoint);
		return;
	}

	if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE) && myTurn()) {
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.hidePossibleMovePoints(true, move);

			if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
				var moveSucceeded = this.theGame.runNotationMove(move, true);

				if (!moveSucceeded) {
					this.resetNotationBuilder(this.notationBuilder.offerDraw);
					this.callActuate();
					return;
				}

				this.gameNotation.addMove(move);

				if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
					createGameIfThatIsOk(this.getGameTypeId());
				} else if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					finalizeMove();
				}
			} else {
				this.resetNotationBuilder();
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.resetNotationBuilder(this.notationBuilder.offerDraw);
		}
	}
};

ShinController.prototype.getTheMessage = function(tile, ownerName) {
	var message = [];
	var tileCode = tile.code;
	var heading = ShinTile.getTileName(tileCode);

	if (tileCode === ShinTileCodes.Rose) {
		message.push('Flower tile');
		message.push('Deploy in Vaatu Territory');
		message.push('Moves up to 3 spaces diagonally');
		message.push('Bonds with Dragon to make your Lion Turtle Fire');
	} else if (tileCode === ShinTileCodes.Jasmine) {
		message.push('Flower tile');
		message.push('Deploy in Raava Territory');
		message.push('Moves up to 3 spaces diagonally');
		message.push('Bonds with Sky Bison to make your Lion Turtle Air');
	} else if (tileCode === ShinTileCodes.Lily) {
		message.push('Flower tile');
		message.push('Deploy in Raava Territory');
		message.push('Moves up to 3 spaces diagonally');
		message.push('Bonds with Koi to make your Lion Turtle Water');
	} else if (tileCode === ShinTileCodes.Chrysanthemum) {
		message.push('Flower tile');
		message.push('Deploy in Vaatu Territory');
		message.push('Moves up to 3 spaces diagonally');
		message.push('Bonds with Badgermole to make your Lion Turtle Earth');
	} else if (tileCode === ShinTileCodes.Dragon) {
		message.push('Master tile');
		message.push('Deploy in Vaatu Territory');
		message.push('Moves up to 4 spaces diagonally and may jump over tiles');
		message.push('Can capture Flower tiles once both Lotuses are on the board');
	} else if (tileCode === ShinTileCodes.SkyBison) {
		message.push('Master tile');
		message.push('Deploy in Raava Territory');
		message.push('Moves up to 4 spaces diagonally and may jump over tiles');
		message.push('Can capture Flower tiles once both Lotuses are on the board');
	} else if (tileCode === ShinTileCodes.Koi) {
		message.push('Master tile');
		message.push('Deploy in Raava Territory');
		message.push('Moves up to 4 spaces orthogonally');
		message.push('Can capture Flower tiles once both Lotuses are on the board');
	} else if (tileCode === ShinTileCodes.Badgermole) {
		message.push('Master tile');
		message.push('Deploy in Vaatu Territory');
		message.push('Moves up to 4 spaces orthogonally');
		message.push('Can capture Flower tiles once both Lotuses are on the board');
	} else if (tileCode === ShinTileCodes.LionTurtle) {
		message.push('Spirit tile');
		message.push('Deploy in Spirit Wilds (forced once all Master tiles are on the board)');
		message.push('Starts neutral (1 space any direction). Becomes elemental from an active Bond');
		message.push('When elemental, moves the same distance and direction as the Master tile tied to its element, but cannot jump. Loses element if Bond is broken');
		message.push('Can capture Master tiles and the opponent\'s Lion Turtle once both Lotuses are on the board');
		message.push('A captured Lion Turtle returns to its owner\'s reserve and can be redeployed');
	} else if (tileCode === ShinTileCodes.Lotus) {
		message.push('Spirit tile');
		message.push('Deploy after your first Bond, in Raava or Vaatu Territory based on that Bond');
		message.push('Moves up to 2 spaces');
		message.push('Cannot capture');
	}

	return { heading: heading, ownerName: ownerName, message: message };
};

ShinController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");
	var ownerName = divName.charAt(0) === 'G' ? GUEST : HOST;
	var tile = new ShinTile(divName.substring(1), divName.charAt(0));
	return this.getTheMessage(tile, ownerName);
};

ShinController.prototype.getPointMessage = function(htmlPoint) {
	var notationPoint = new NotationPoint(htmlPoint.getAttribute("name"));
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (boardPoint.hasTile()) {
		return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName);
	}

	return this.getTerritoryMessage(boardPoint);
};

ShinController.prototype.getTerritoryMessage = function(boardPoint) {
	if (boardPoint.isType(SHIN_MOUNTAIN)) {
		return { heading: 'Mountain', message: ['Tiles cannot be deployed or moved here'] };
	}
	if (boardPoint.isType(SHIN_SPIRIT_WILDS)) {
		return { heading: 'Spirit Wilds', message: ['Lion Turtle deployment zone'] };
	}
	if (boardPoint.isType(SHIN_RAAVAATU)) {
		return { heading: 'Raava-Vaatu Border', message: ['Raava and Vaatu Territory', 'All Flowers and Masters can be deployed here'] };
	}
	if (boardPoint.isType(SHIN_RAAVA)) {
		return { heading: 'Raava Territory', message: ['Deploy Jasmine, Lily, Sky Bison, and Koi here'] };
	}
	if (boardPoint.isType(SHIN_VAATU)) {
		return { heading: 'Vaatu Territory', message: ['Deploy Rose, Chrysanthemum, Dragon, and Badgermole here'] };
	}
	return null;
};

ShinController.prototype.playAiTurn = function(finalizeMove) {
	if (this.theGame.hasEnded()) {
		return;
	}

	var theAi = activeAi;
	if (activeAi2) {
		if (activeAi2.player === this.getCurrentPlayer()) {
			theAi = activeAi2;
		}
	}

	var playerMoveNum = this.gameNotation.getPlayerMoveNum();
	var self = this;

	setTimeout(function() {
		var move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);
		if (!move) {
			debug("Shin AI: No move found");
			return;
		}
		self.gameNotation.addMove(move);
		finalizeMove();
	}, 10);
};

ShinController.prototype.startAiGame = function(finalizeMove) {
	this.playAiTurn(finalizeMove);
};

ShinController.prototype.getAiList = function() {
	return [new ShinAI('easy')];
};

ShinController.prototype.getCurrentPlayer = function() {
	return currentMoveIndex % 2 === 0 ? HOST : GUEST;
};

ShinController.prototype.runMove = function(move, withActuate) {
	this.theGame.runNotationMove(move, withActuate);
};

ShinController.prototype.cleanup = function() {};

ShinController.prototype.isSolitaire = function() { return false; };

ShinController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

ShinController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Shin Pai Sho Preferences:";

	var movePeekingDiv = document.createElement("div");
	var movePeekingText = "Opponent move and replay peeking is ";
	movePeekingText += this.peekAtOpponentMoves ? "enabled" : "disabled";
	movePeekingText += ". ";
	movePeekingDiv.innerText = movePeekingText;

	var movePeekingToggleSpan = document.createElement("span");
	movePeekingToggleSpan.innerText = "Toggle";
	movePeekingToggleSpan.classList.add("skipBonus");
	movePeekingToggleSpan.onclick = function() {
		gameController.togglePeekAtOpponentMoves();
	};
	movePeekingDiv.appendChild(movePeekingToggleSpan);

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(ShinController.buildTileDesignDropdownDiv());
	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(this.buildToggleRuleHintsDiv());
	settingsDiv.appendChild(document.createElement("br"));

	return settingsDiv;
};

ShinController.prototype.buildToggleAnimationsDiv = function() {
	var div = document.createElement("div");
	div.id = "shinAnimationsToggleDiv";
	var onOrOff = this.isAnimationsEnabled() ? "on" : "off";
	div.innerHTML = "Move animations are " + onOrOff + ": <span class='skipBonus' onclick='gameController.toggleAnimations();'>toggle</span>";
	return div;
};

ShinController.prototype.toggleAnimations = function() {
	if (this.isAnimationsEnabled()) {
		setUserGamePreference(ShinConstants.animationsEnabledKey, "false");
		this.actuator.setAnimationOn(false);
	} else {
		setUserGamePreference(ShinConstants.animationsEnabledKey, "true");
		this.actuator.setAnimationOn(true);
	}
	var div = document.getElementById("shinAnimationsToggleDiv");
	if (div) {
		var onOrOff = this.isAnimationsEnabled() ? "on" : "off";
		div.innerHTML = "Move animations are " + onOrOff + ": <span class='skipBonus' onclick='gameController.toggleAnimations();'>toggle</span>";
	}
};

ShinController.prototype.buildToggleRuleHintsDiv = function() {
	var div = document.createElement("div");
	div.id = "shinRuleHintsToggleDiv";
	var onOrOff = this.isRuleHintsEnabled() ? "on" : "off";
	div.innerHTML = "Game guidance are " + onOrOff + ": <span class='skipBonus' onclick='gameController.toggleRuleHints();'>toggle</span>";
	return div;
};

ShinController.prototype.toggleRuleHints = function() {
	if (this.isRuleHintsEnabled()) {
		setUserGamePreference(ShinConstants.ruleHintsEnabledKey, "false");
	} else {
		setUserGamePreference(ShinConstants.ruleHintsEnabledKey, "true");
	}
	var div = document.getElementById("shinRuleHintsToggleDiv");
	if (div) {
		var onOrOff = this.isRuleHintsEnabled() ? "on" : "off";
		div.innerHTML = "Game guidance are " + onOrOff + ": <span class='skipBonus' onclick='gameController.toggleRuleHints();'>toggle</span>";
	}
	this.theGame.actuate();
	refreshMessage();
};

ShinController.prototype.isRuleHintsEnabled = function() {
	return getUserGamePreference(ShinConstants.ruleHintsEnabledKey) !== "false";
};

ShinController.prototype.isAnimationsEnabled = function() {
	return getUserGamePreference(ShinConstants.animationsEnabledKey) !== "false";
};

ShinController.prototype.setCustomTileDesignUrl = function(url) {
	ShinPreferences.customTilesUrl = url;
	ShinController.savePreferences();
	localStorage.setItem(ShinConstants.tileDesignTypeKey, 'custom');

	if (gameController && gameController.callActuate) {
		gameController.callActuate();
	}
};

ShinController.prototype.setAnimationsOn = function(isAnimationsOn) {
	if (isAnimationsOn !== this.isAnimationsEnabled()) {
		this.toggleAnimations();
	}
};
