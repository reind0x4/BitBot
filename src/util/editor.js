/**
 * Copyright 2013 Sweet Carolina Games
 */

/**
 * @file editor.js
 * @author Ian Coleman <ian@sweetcarolinagames.com>
 * 
 * Tile-based visual level editor tool
 */


$(document).ready(function() {
	Editor.init(12, 12);
}); 

/**
 * Using JSON-like class definition since
 * Editor is a singleton
 * @author Ian Coleman
 */
var Editor = {
		
	width: 0, // counted in number of tiles
	tileWidthPx: 40,
	height: 0, // counted in number of tiles
	tileHeightPx: 40,
	grid: [],
	mouseDown: false,
	editorContainer: null,
	printoutContainer: null,
	keyModifier: undefined,
	generateGridButton: null,
	goalLimit: 1,
	goalCount: 0,
	startLimit: 1,
	startCount: 0,
	maxHorizontalTile: 0,
	minHorizontalTile: 0,
	maxVerticalTile: 0,
	minVerticalTile: 0,
	maxGameplayWidth: 12,
	maxGameplayHeight: 12,
	
	// tile type enum
	tileTypes:  {
		UNDEFINED: 0,
		FLAT: 1,
		START: 3,
		GOAL: 4,
		RAISED: 8
	},

	/**
	 * Sets up the Editor
	 * @author Ian Coleman
	 * @param int widthTileCount -- number of tiles across
	 * @param int heightTileCount -- number of tiles down
	 */
	init: function(widthTileCount, heightTileCount) {
		this.width = widthTileCount;
		this.height = heightTileCount;
		this.editorContainer = $("#editor-container");
		this.printoutContainer = $("#printout-container");
		this.generateGridButton = $("#editor-gen-grid-btn");
		$("#alert").hide();
		this.clearGrid();
		this.draw();
		this.attachBehaviors();
		var editor = this;
		
		$(document).keydown(function(event) {
			if(event.which == 70) {
				editor.keyModifier = 'f';
			}
			else if(event.which == 82) {
				editor.keyModifier = 'r';
			} 
			else if(event.which == 83) {
				editor.keyModifier = 's';
			}
			else if(event.which == 71) {
				editor.keyModifier = 'g';
			} 
		});
		
		$(document).keyup(function(event) {
			editor.keyModifier = undefined;
			console.log("key modifier undefined");
		});
	},
	
	/**
	 * Sets all tiles to value -1 (empty tile)
	 * @author Ian Coleman
	 */
	clearGrid: function() {
		for(var i=0; i < this.height; i++) {
			this.grid[i] = new Array(this.width);
			for(var j=0; j < this.width; j++) {
				this.grid[i][j] = 0;
			}
		}
	},
	
	/**
	 * Draws flat representation of grid
	 * @author Ian Coleman
	 */
	draw: function() {
		var width = this.tileWidthPx;
		var height = this.tileHeightPx;
		var gridContainer = $("#editor-grid-container");
		$.each(this.grid, function(rowIndex, row) {						
			$.each(row, function(index, value) {
				var editorTile = $("<div class='editor-tile'></div>");
				editorTile.attr('x', index);
				editorTile.attr('y', rowIndex);				
				var leftOffset = index * width;
				var topOffset = rowIndex * height;
				editorTile.css({left: leftOffset+"px", top: topOffset+"px"});
				gridContainer.append(editorTile);
			});			
		});	
		this.editorContainer.append(gridContainer);
	},
	
	/**
	 * Attaches mouse events to elements
	 * @author Ian Coleman
	 */
	attachBehaviors: function() {
		var gridContainer = $("#editor-grid-container");
		var editor = this;
		
		// set mouseDown
		$("body").on("mousedown", null, null, function(event) {
			if(event.which == 1) {
				editor.mouseDown = true;
			}
		});
		
		// clear mouseDown
		$("body").on("mouseup", null, null, function(event) {
			if(event.which == 1) {
				editor.mouseDown = false;
			}
		});
		
		// attach mousedown behavior to tiles in grid
		gridContainer.on('mousedown', '.editor-tile', function(event) {
			editor.mouseDown = true;
			editor.updateTile($(this));
		});
		
		// attach mouseover behavior to tiles in grid
		gridContainer.find('.editor-tile').on('mouseover', function(event) {
			if(editor.mouseDown) {
				editor.updateTile($(this));
			}
		});
		
		// generate grid definition button click
		this.generateGridButton.on('click', null, null, function(event) {
			editor.submitOutputGrid();
		});
	},
	
	/**
	 * Sets styles,attributes for @tile of corresponding to @type
	 * @author Ian Coleman
	 * @param object tile
	 * @param int type
	 */
	setTileType: function(tile, type) {
		// remove file type style
		tile.removeClass('[class*=" editor-tile-"]');
				
		// remove previously set 'editor-tile-<type>' class
//		$('[class*=" editor-tile-"]').removeClass(function(i, c) {
//			return c.match(/editor-tile-[a-zA-Z]+/g).join(" ");
//		});
		
		switch(type) {
		case this.tileTypes.FLAT:
			tile.addClass("editor-tile-flat");
			break;
		case this.tileTypes.START:
			if(this.startCount + 1 > this.startLimit) {
				this.showAlert("start tile limit reached");
			} else {
				tile.addClass("editor-tile-start");
				this.startCount++;
			}
			break;
		case this.tileTypes.GOAL:			
			if(this.goalCount + 1 > this.goalLimit) {
				this.showAlert("goal tile limit reached");
			} else {
				tile.addClass("editor-tile-goal");
				this.goalCount++;
			}
			break;
		case this.tileTypes.RAISED:
			tile.addClass("editor-tile-raised");
			break;
		case this.tileTypes.UNDEFINED:
		default:
			tile.addClass("editor-tile-undefined");
			break;
		}
	},
	
	/**
	 * Updates tile info based on input events
	 */
	updateTile: function(tile) {
		var editor = this;
		
		var tileType = undefined;
		var rowIndex = parseInt(tile.attr('y'));
		var columnIndex = parseInt(tile.attr('x'));
		
		if(this.val)
		
		if(editor.keyModifier === 'r') {					
			tileType = editor.tileTypes.RAISED;					
		}
		else if(editor.keyModifier === 's') {					
			tileType = editor.tileTypes.START;					
		}
		else if(editor.keyModifier === 'g') {					
			tileType = editor.tileTypes.GOAL;					
		}
		else if(editor.keyModifier === 'f') {
			tileType = editor.tileTypes.FLAT;
		}
		else if(editor.keyModifier === undefined) {
			tileType = editor.tileTypes.UNDEFINED;
		}
		
		editor.setTileType(tile, tileType);
		editor.updateGrid(columnIndex, rowIndex, tileType);
	},
	
	/**
	 * Sets value of grid at index <x,y>
	 */
	updateGrid: function(x, y, value) {
		this.grid[y][x] = value;
	},
	
	/**
	 * Handler for button that outputs grid definition
	 * @author Ian Coleman
	 */
	submitOutputGrid: function(button) {		
		this.outputGrid();
		this.showAlert("outputting grid");
	},
	
	/**
	 * @author Ian Coleman
	 */
	outputGrid: function() {
		var editor = this;
		editor.printoutContainer.empty();	
		
		editor.printoutContainer.append("[");
		$.each(this.grid, function(index, row) {
			editor.printoutContainer.append("<span class='editor-output-row'>[" + row.toString() + "]" + ((index < $(this).length-1) ? "," : "") + "<span><br />");			
		});
		editor.printoutContainer.append("]");
	},
	
	showAlert: function(msg) {
		$("#alert").html(msg).fadeIn(500).delay(3000).fadeOut(500);
	},
	
	validateTilePlacement: function(tile) {
		var tileX = tile.attr('x'); 
		var tileY = tile.attr('y');
		
		// check horizontal dimension
		if (tileX < this.minHorizontalTile && (this.maxHorizontalTile - tileX) <= this.maxGameplayWidth) {
			this.updateMinHorizontalTile(tileX);
		}
		else if (tileX > this.maxHorizontalTile && (tileX - this.minHorizontalTile) <= this.maxGameplayWidth) {
			this.updateMaxHorizontalTile(tileX);
		} else {
			return false;
		}
		// check vertical dimension		
		if (tileY < this.minVerticalTile && (this.maxVerticalTile - tileY) <= this.maxGameplayHeight) {
			this.updateMinVerticalTile(tileY)
		}
		else if (tileY < this.maxVerticalTile && (tileY - this.minVerticalTile) <= this.maxGameplayHeight) {
			this.updateMaxVerticalTile(tileY)
		} else {
			return false;
		}
		return true;
		
	},
	
//	validateDimensions: function(width, height) {
//		return (width <= this.maxGameplayWidth && height <= this.maxGameplayHeight);
//	},
	
	updateMaxHorizontalTile: function(xIndex) {
		this.maxHorizontalTile = xIndex;		
	}, 
	
	updateMinHorizontalTile: function(xIndex) {
		this.minHorizontalTile = xIndex;
	},
	
	updateMaxVerticalTile: function(yIndex) {
		this.maxVerticalTile = yIndex;
	},
	
	updateMinVerticalTile: function(yIndex) {
		this.minVerticalTile = yIndex;
	},
};

