// Shin Actuator

function ShinActuator(gameContainer, isMobile, enableAnimations) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;
	this.animationOn = enableAnimations !== false;
	this.loggedMissingImages = {};
	this.loggedMissingContainers = {};

	var containers = setupPaiShoBoard(
		this.gameContainer,
		ShinController.getHostTilesContainerDivs(),
		ShinController.getGuestTilesContainerDivs(),
		true
	);

	this.boardContainer = containers.boardContainer;
	this.boardContainer.style.position = 'relative';
	this.arrowContainer = containers.arrowContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

ShinActuator.prototype.setAnimationOn = function(isOn) {
	this.animationOn = isOn;
};

ShinActuator.prototype.actuate = function(board, tileManager, markingManager, moveToAnimate) {
	var self = this;

	window.requestAnimationFrame(function() {
		self.htmlify(board, tileManager, markingManager, moveToAnimate);
	});
};

ShinActuator.prototype.htmlify = function(board, tileManager, markingManager, moveToAnimate) {
	this.clearContainer(this.boardContainer);

	if (this.arrowContainer) {
		this.clearContainer(this.arrowContainer);
	}

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (!cell) {
				return;
			}

			if (markingManager && markingManager.pointIsMarked) {
				if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)) {
					cell.addType(MARKED);
				} else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)) {
					cell.removeType(MARKED);
				}
			}

			self.addBoardPoint(cell, moveToAnimate);
		});
	});

	if (this.arrowContainer && markingManager && markingManager.arrows) {
		for (var key in markingManager.arrows) {
			if (markingManager.arrows.hasOwnProperty(key)) {
				var arrow = markingManager.arrows[key];
				this.arrowContainer.appendChild(createBoardArrow(arrow[0], arrow[1]));
			}
		}
	}

	var fullTileSet = new ShinTileManager();

	fullTileSet.hostTiles.forEach(function(tile) {
		self.clearTileContainer(tile);
	});
	fullTileSet.guestTiles.forEach(function(tile) {
		self.clearTileContainer(tile);
	});

	tileManager.hostTiles.forEach(function(tile) {
		self.addTile(tile, self.hostTilesContainer);
	});
	tileManager.guestTiles.forEach(function(tile) {
		self.addTile(tile, self.guestTilesContainer);
	});

};

ShinActuator.prototype.clearContainer = function(container) {
	while (container && container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

ShinActuator.prototype.clearTileContainer = function(tile) {
	var container = document.querySelector('.' + tile.getImageName());

	if (!container) {
		this.logMissingContainer(tile.getImageName(), 'pile-clear');
		return;
	}

	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

ShinActuator.prototype.addTile = function(tile, mainContainer) {
	var container = document.querySelector('.' + tile.getImageName());

	if (!container) {
		this.logMissingContainer(tile.getImageName(), 'pile-add');
		container = mainContainer;
	}

	if (!container) {
		debug('[ShinActuator] No fallback pile container for ' + tile.getImageName());
		return;
	}

	var theDiv = document.createElement('div');
	theDiv.classList.add('point');
	theDiv.classList.add('hasTile');

	if (tile.selectedFromPile) {
		theDiv.classList.add('selectedFromPile');
		theDiv.classList.add('drained');
	}

	var theImg = document.createElement('img');
	var srcValue = this.getTileImageSourceDir();
	var imagePath = srcValue + tile.getImageName() + '.png';

	theImg.src = imagePath;
	this.attachImageDebug(theImg, imagePath, 'pile', tile.getImageName());

	theDiv.appendChild(theImg);

	theDiv.setAttribute('name', tile.getImageName());
	theDiv.setAttribute('id', tile.id);

	if (this.mobile) {
		theDiv.addEventListener('click', function() {
			unplayedTileClicked(theDiv);
			showTileMessage(theDiv);
		});
	} else {
		theDiv.addEventListener('click', function() {
			unplayedTileClicked(theDiv);
		});
		theDiv.addEventListener('mouseover', function() {
			showTileMessage(theDiv);
		});
		theDiv.addEventListener('mouseout', clearMessage);
	}

	container.appendChild(theDiv);
};

ShinActuator.prototype.addBoardPoint = function(boardPoint, moveToAnimate) {
	var theDiv = createBoardPointDiv(boardPoint);

	if (!boardPoint.isType(NON_PLAYABLE)) {
		theDiv.classList.add('activePoint');

		if (boardPoint.isType(MARKED)) {
			theDiv.classList.add('markedPoint');
		}
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			theDiv.classList.add('possibleMove');
		}

		if (this.mobile) {
			theDiv.setAttribute('ontouchstart', 'pointClicked(this); showPointMessage(this);');
		} else {
			theDiv.addEventListener('click', function() {
				pointClicked(theDiv);
			});
			theDiv.addEventListener('mouseover', function() {
				showPointMessage(theDiv);
			});
			theDiv.addEventListener('mouseout', clearMessage);
			theDiv.addEventListener('mousedown', function(e) {
				if (e.button === 2) {
					RmbDown(theDiv);
				}
			});
			theDiv.addEventListener('mouseup', function(e) {
				if (e.button === 2) {
					RmbUp(theDiv);
				}
			});
			theDiv.addEventListener('contextmenu', function(e) {
				e.preventDefault();
			});
		}
	}

	if (boardPoint.hasTile()) {
		theDiv.classList.add('hasTile');

		var theImg = document.createElement('img');
		theImg.elementStyleTransform = new ElementStyleTransform(theImg);
		theImg.elementStyleTransform.setValue('rotate', 315, 'deg');

		if (moveToAnimate) {
			this.doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv);
		}

		var srcValue = this.getTileImageSourceDir();
		var imagePath = srcValue + boardPoint.tile.getImageName() + '.png';

		theImg.src = imagePath;
		this.attachImageDebug(theImg, imagePath, 'board', boardPoint.tile.getImageName());

		theDiv.appendChild(theImg);

		if (this.animationOn && moveToAnimate && moveToAnimate.capturedTile && isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
			var theImgCaptured = document.createElement('img');
			theImgCaptured.elementStyleTransform = new ElementStyleTransform(theImgCaptured);
			theImgCaptured.elementStyleTransform.setValue('rotate', 315, 'deg');
			theImgCaptured.src = srcValue + moveToAnimate.capturedTile.getImageName() + '.png';
			theImgCaptured.classList.add('underneath');
			theDiv.appendChild(theImgCaptured);

			setTimeout(function() {
				requestAnimationFrame(function() {
					theImgCaptured.style.visibility = 'hidden';
				});
			}, pieceAnimationLength);
		}
	}

	this.boardContainer.appendChild(theDiv);
};

ShinActuator.prototype.doAnimateBoardPoint = function(boardPoint, moveToAnimate, theImg, theDiv) {
	if (!this.animationOn) return;

	var x = boardPoint.col, y = boardPoint.row, ox = x, oy = y;

	if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
		if (isSamePoint(moveToAnimate.endPoint, x, y)) {
			x = moveToAnimate.startPoint.rowAndColumn.col;
			y = moveToAnimate.startPoint.rowAndColumn.row;
			theImg.elementStyleTransform.setValue('scale', '1.2');
			theDiv.style.zIndex = 99;
		}
	} else if (moveToAnimate.moveType === DEPLOY) {
		if (isSamePoint(moveToAnimate.endPoint, ox, oy)) {
			if (piecePlaceAnimation === 1) {
				theImg.elementStyleTransform.setValue('scale', 2);
				theDiv.style.zIndex = 99;
				requestAnimationFrame(function() {
					theImg.elementStyleTransform.setValue('scale', 1);
				});
			}
		}
	}

	var pointSizeMultiplierX = 34;
	var pointSizeMultiplierY = pointSizeMultiplierX;
	var unitString = 'px';

	if (window.innerWidth <= 612) {
		pointSizeMultiplierX = 5.5555;
		pointSizeMultiplierY = 5.611;
		unitString = 'vw';
	}

	theImg.style.left = ((x - ox) * pointSizeMultiplierX) + unitString;
	theImg.style.top = ((y - oy) * pointSizeMultiplierY) + unitString;
	requestAnimationFrame(function() {
		theImg.style.left = '0px';
		theImg.style.top = '0px';
	});
	setTimeout(function() {
		requestAnimationFrame(function() {
			theImg.elementStyleTransform.setValue('scale', 1);
		});
	}, pieceAnimationLength);
};

ShinActuator.prototype.attachImageDebug = function(img, imagePath, location, imageName) {
	var key = location + ':' + imagePath;
	var self = this;

	img.addEventListener('error', function() {
		if (!self.loggedMissingImages[key]) {
			self.loggedMissingImages[key] = true;
			debug('[ShinActuator] Missing ' + location + ' image for ' + imageName + ': ' + imagePath);
		}
	});
};

ShinActuator.prototype.logMissingContainer = function(imageName, location) {
	var key = location + ':' + imageName;

	if (!this.loggedMissingContainers[key]) {
		this.loggedMissingContainers[key] = true;
		debug('[ShinActuator] Missing ' + location + ' container for .' + imageName);
	}
};

ShinActuator.prototype.getTileImageSourceDir = function() {
	return ShinController.getTileImageSourceDir();
};
