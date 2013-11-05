function Level(level_data) {

	/* These correspond to the tile (flat) representation of the level.*/
	var tile_map;
	var level_tiles;

	/* These correspond to the block (isometric) representation of the level.*/
	var block_map;
	var level_blocks;

	/* Class attributes */
	this.isDisplayingFlat = true;
	// Are we displaying flat?
	this.level_data = level_data;

	/* Class initialization */
	setup(level_data);

	this.update = function() {

	}

	this.draw = function() {
		if (this.isDisplayingFlat) {
			// draw flat
			level_tiles.draw();
		} else {
			// draw block (isometric)
			level_blocks.draw();
		}
	}

	this.toggleDisplayType = function() {
		this.isDisplayingFlat = !(this.isDisplayingFlat);
	}
	
	function setup(level_data) {
		var cell_width = jaws.TileMap.prototype.default_options.cell_size[0];
		// 32
		var cell_height = jaws.TileMap.prototype.default_options.cell_size[1];
		// 32

		var canvas_width = jaws.width;
		// 768
		var canvas_height = jaws.height;
		// 576

		var num_of_horiz_cells = canvas_width / cell_width;
		// 24
		var num_of_vert_cells = canvas_height / cell_height;
		// 18

		/* Flat world setup */
		tile_map = new jaws.TileMap({
			size : [num_of_horiz_cells, num_of_vert_cells],
			cell_size : [cell_width, cell_height]
		});

		level_tiles = setup_level_tiles(level_data, num_of_vert_cells, num_of_horiz_cells, cell_width - 1, cell_height - 1);
		tile_map.push(level_tiles);
		// cell_width and cell_height are modified by -1 so that when drawn, the border lines overlap, as opposed to
		// lying side by side (if they are side by side, they create a "bolded line" effect)

		/* Block (orthographic) world setup */
		block_map = new jaws.TileMap({
			size : [num_of_horiz_cells, num_of_vert_cells],
			cell_size : [cell_width, cell_height]
		});

		//level_blocks = setup_level_blocks(level_data, num_of_vert_cells, num_of_horiz_cells, cell_width, cell_height);
		//block_map.push(level_blocks);

		console.log("Level.js: setup complete");
	}

	function setup_level_tiles(level_data, max_rows, max_cols, tile_width, tile_height) {
		var lvl_tiles = new jaws.SpriteList();
		for (var row_idx = 0; row_idx < max_rows; row_idx++) {
			for (var col_idx = 0; col_idx < max_cols; col_idx++) {
				var data = level_data[row_idx][col_idx];
				var img_string = img_string_lookup(data,true); //its true, we're looking for tiles (as opposed to blocks)
				if (img_string != null) {
					var tile = new jaws.Sprite({
						image : img_string,
						x : col_idx * tile_width,
						y : row_idx * tile_height
					});

					lvl_tiles.push(tile);
				}
			}
		}
		return lvl_tiles;
	}

	function setup_level_blocks(level_data, max_rows, max_cols, tile_width, tile_height) {

		var lvl_blocks = new jaws.SpriteList();
		transformed_level_data = antidiagonal_transform(level_data);

		for (var row_idx = 0; row_idx < max_rows; row_idx++) {
			for (var col_idx = 0; col_idx < max_cols; col_idx++) {
				var data = transformed_level_data[row_idx][col_idx];
				var img_string;
				if (data != -1) {

				}
			}
		}
	}
	

	/**
	 * Looks up the tile image that corresponds to the parameter level data
	 * @param {Object} data the level tile
	 * @param {Boolean} whether or not we're looking up a tile (alternative is a block)
	 * @return {String} the directory path of the tile image
	 */
	function img_string_lookup(data, is_tile) {

		var img_string = null;
		var is_D_stair = false;
		var is_R_stair = false;

		if (data != -1) {
			if (data >= 40) {//an end tile
				img_string = is_tile ? "./assets/art/GoalTile.png" : "./assets/art/GoalBlock.png";
			} else if (data >= 30) {//a start tile
				img_string = is_tile ? "./assets/art/StartTile.png": "./assets/art/StartBlock.png";
			} else if (data >= 20) {//a down-pointing staircase tile
				is_D_stair = true;
				data = data - 20;
			} else if (data >= 10) {//a right-pointing staircase tile
				is_R_stair = true;
				data = data - 10;
			} else {
				
			}

			if (data == 4) {//a gap tile
				img_string = "./assets/art/TileGap.png";
			} else if (data == 3) {//a level 3 block
				if (is_D_stair) {
					img_string = is_tile ? "./assets/art/Level3TileLadderD.png" : "./assets/art/LadderLeftBlock.png";
				} else if (is_R_stair) {
					img_string = is_tile ? "./assets/art/Level3TileLadderR.png" : "./assets/art/LadderRightBlock.png";
				} else {
					img_string = is_tile ? "./assets/art/Level3Tile.png" : "./assets/art/Block.png";
				}
			} else if (data == 2) {//a level 2 block
				if (is_D_stair) {
					img_string = is_tile ? "./assets/art/Level2TileLadderD.png" : "./assets/art/LadderLeftBlock.png";
				} else if (is_R_stair) {
					img_string = is_tile ? "./assets/art/Level2TileLadderR.png" : "./assets/art/LadderRightBlock.png";
				} else {
					img_string = is_tile ? "./assets/art/Level2Tile.png" : "./assets/art/Block.png";
				}
			} else if (data == 1) {//a level 1 block
				if (is_D_stair) {
					img_string = is_tile ? "./assets/art/Level1TileLadderD.png" : "./assets/art/LadderLeftBlock.png";
				} else if (is_R_stair) {
					img_string = is_tile ? "./assets/art/Level1TileLadderR.png" : "./assets/art/LadderRightBlock.png";
				} else {
					img_string = is_tile ? "./assets/art/Level1Tile.png" : "./assets/art/Block.png";
				}

			} else if (data == 0) {//a level 0 block
				img_string = is_tile ? "./assets/art/Level0Tile.png" : "./assets/art/Block.png";
			} else {
								
			}
		}
		return img_string;
	}
}

	
