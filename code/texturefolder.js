// ===================================================================
// th.gl.texturefolder
// load a folder with images in an array of textures
// 
// written by Timo Hoogland 2020, www.timohoogland.com
// MIT License
// ===================================================================

autowatch = 1;
inlets = 1;
outlets = 2;

// use the first argument as context
var ctx;
if (jsarguments[1] === 0){
	error('th.gl.texturefolder: please initialize with a named rendering context \n');
} else {
	ctx = jsarguments[1];
}
// the keyword to use for the texturenaming
var base = (!isNaN(jsarguments[2]))? 'tex' : jsarguments[2];

// initialize empty textureset
var textureSet = [];

// set the rendering context 
// (usually jit.world name)
function drawto(d){
	ctx = d;
	for (i in textureSet){
		textureSet[i].drawto = d;
	}
}

// set the base name for the textures 
// (default is tex0, tex1, tex2...)
function name(n){
	base = n;
	for (i in textureSet){
		textureSet[i].name = n + i;
	}
}

// load a folder of images in the textureset
function folder(path){
	// empty the textureset
	clear();
	// load the Folder object
	var fold = new Folder(path);
	// restrict to imagetype files
	fold.typelist = ["JPEG", "JPG", "PNG", "TIFF"];
	fold.reset();
	while (!fold.end){
		if (fold.filename !== ''){
			var file = fold.pathname + "/" + fold.filename;
			// post('load', fold.filename, "\n");
			// load every image in the textureset;
			add(file);
		}
		fold.next();
	}
	fold.close();
	
	getcount();
	getnames();
}

// add a single texture to the set loaded from filepath
function add(f){
	// post('load file from:', f, "\n");
	var tex = new JitterObject('jit.gl.texture', ctx);
	tex.name = base + textureSet.length;	
	tex.read(f);
	// post('dim:', tex.dim[0], tex.dim[1], "\n");
	textureSet.push(tex);

	getcount();
	getnames();
}

// output the selected texture based on the index
// also output the total count and the dimension of selected texture
function outputtexture(i){
	// getcount();
	if (i >= 0 && i < textureSet.length){
		outlet(1, "dim", textureSet[i].dim[0], textureSet[i].dim[1]);
		outlet(0, "jit_gl_texture", textureSet[i].name);
	}
}

// output all the texture names as a list
function getnames(){
	var names = [];
	for (var i in textureSet){
		names[i] = textureSet[i].name;
	}
	outlet(1, 'names', names);
}

// output the amount of loaded textures
function getcount(){
	outlet(1, 'count', textureSet.length);
}

// clear the textureset
function clear(){
	for (i in textureSet){
		textureSet[i].freepeer();
	}
	textureSet = [];
}
