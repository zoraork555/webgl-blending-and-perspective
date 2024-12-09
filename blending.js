// This program creates an environment to observe.
// This environment consists of three walls, one to each side and one in front.
// There is also a floor. On the wall in front there is a window.
// The window panes have a strong green color on them which the program uses as a chroma key.
// When this key is found in the fragment shader, the fragment's alpha is set to 0.
// Because of this, the user can see through the window to the outside which has a view of a hellscape.
// If you want to view more of the hellscape, the arrow keys can be used to adjust the location of the camera.
// This is limited to twice changed in any direction from start, leaving a 5x5 pattern that can be viewed from.
// The documentation called for the "at" to be changed, so that different parts of outside could be viewed.
// This program changes the "eye" location, because changing the at does not change what is viewed throgh the window.
// 
// Code is further explained below.

var canvas;
var gl;

// arrays that hold important data for the shaders
var points = [];
var colors = [];
var texCoordsArray = [];

// variables that control the view of the environment
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye    = vec3(0.0, -0.1, 0.0);
var eyeRef = vec3(0.0, -0.1, 0.0); // var that doesn't get edited for reference in arrow listener
var at = vec3(0.0, -0.15, -0.5);
var up = vec3(0.0, 1.0, 0.0);

// vars that hold textures
var wallTex;
var windowTex;
var hellTex;

// array that holds coords for reference when assigning texture locations
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

// array that holds points for use in quad()
var vertices = [
    vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5,  0.9,  0.5 ),
    vec3(  0.5,  0.9,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5,  0.9, -0.5 ),
    vec3(  0.5,  0.9, -0.5 ),
    vec3(  0.5, -0.5, -0.5 )
];

// array that holds colors for use in quad()
var vertexColors = [
    [ 0.0, 0.0, 0.0, 0.5 ],  // black
    [ 1.0, 0.0, 0.0, 0.5 ],  // red
    [ 1.0, 1.0, 0.0, 0.5 ],  // yellow
    [ 0.0, 1.0, 0.0, 0.5 ],  // green
    [ 0.0, 0.0, 1.0, 0.5 ],  // blue
    [ 1.0, 0.0, 1.0, 0.5 ],  // magenta
    [ 0.0, 1.0, 1.0, 0.5 ],   // cyan
    [ 1.0, 1.0, 1.0, 0.5 ]  // white
];

// function that sets up a texture when given an image, returns texture
function configureTexture( image ) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 
                  gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
}

// given 4 numbers, creates a quadrilateral
function quad(a, b, c, d) 
{
    points.push(vertices[a]); 
    colors.push(vertexColors[a]); 
    texCoordsArray.push(texCoord[0]);

    points.push(vertices[b]); 
    colors.push(vertexColors[a]);
    texCoordsArray.push(texCoord[1]); 

    points.push(vertices[c]); 
    colors.push(vertexColors[a]);
    texCoordsArray.push(texCoord[2]); 
  
    points.push(vertices[a]); 
    colors.push(vertexColors[a]);
    texCoordsArray.push(texCoord[0]); 

    points.push(vertices[c]); 
    colors.push(vertexColors[a]);
    texCoordsArray.push(texCoord[2]); 

    points.push(vertices[d]); 
    colors.push(vertexColors[a]);
    texCoordsArray.push(texCoord[3]); 
}

// given 4 coords, creates a quadrilateral
function background(a, b, c, d) 
{
    points.push(a); 
    colors.push(vec4(0.5, 1.0, 0.5, 1.0)); 
    texCoordsArray.push(texCoord[0]);

    points.push(b); 
    colors.push(vec4(0.5, 1.0, 0.5, 1.0));
    texCoordsArray.push(texCoord[1]); 

    points.push(c); 
    colors.push(vec4(0.5, 1.0, 0.5, 1.0));
    texCoordsArray.push(texCoord[2]); 
  
    points.push(a); 
    colors.push(vec4(0.5, 1.0, 0.5, 1.0));
    texCoordsArray.push(texCoord[0]); 

    points.push(c); 
    colors.push(vec4(0.5, 1.0, 0.5, 1.0));
    texCoordsArray.push(texCoord[2]); 

    points.push(d); 
    colors.push(vec4(0.5, 1.0, 0.5, 1.0));
    texCoordsArray.push(texCoord[3]); 
}

// creates the room
function room()
{
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 5, 4, 0, 1 );
    quad( 4, 5, 6, 7 );
}


window.onload = function ()
{
    // setting up canvas
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // creating the environment
    background(vec3(-1.3, -1.3, -2.0), 
               vec3(-1.3,  1.5, -2.0), 
               vec3( 1.3,  1.5, -2.0), 
               vec3( 1.3, -1.3, -2.0));
    room();

    // setting up environment further
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
    
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // creating buffers and connecting important variables to each
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    // grabbing images from html and creating textures out of them
    var image1 = document.getElementById("wallPic");
    wallTex = configureTexture(image1);
    var image2 = document.getElementById("windowPic");
    windowTex = configureTexture(image2);
    var image3 = document.getElementById("hellPic");
    hellTex = configureTexture(image3);

    // initializing "texture" on the html side
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    // grabbing locations
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    // function that listens for the arrow keys to adjust the view.
    // the math is based on the local "delta" variable for easy editing.
    // "eyeRef" is a second variable for "eye" that is never changed for 
    // reference when checking how far the view has moved.
    // "eye" is edited and then render() is called
    document.onkeydown = function (e) {
        delta = 0.05;
        switch (e.key) {
            case 'ArrowUp':
                if (eye[1] <= (eyeRef[1] + (2*delta) - (delta/100))) {
                    eye[1] += delta;
                    render();
                }
                break;
            case 'ArrowDown':
                if (eye[1] >= (eyeRef[1] - (2*delta) + (delta/100))) {
                    eye[1] -= delta;
                    render();
                }
                break;
            case 'ArrowLeft':
                if (eye[0] >= (eyeRef[0] - (2*delta) + (delta/100))) {
                    eye[0] -= delta;
                    render();
                }
                break;
            case 'ArrowRight':
                if (eye[0] <= (eyeRef[0] + (2*delta) - (delta/100))) {
                    eye[0] += delta;
                    render();
                } 
        }
    };
    render();
}

// renders the environment
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrix  = lookAt(eye, at, up);
    projectionMatrix = perspective(85.0, 1.0, -2.0, 0.0);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.bindTexture(gl.TEXTURE_2D, hellTex);
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
    gl.bindTexture(gl.TEXTURE_2D, windowTex);
    gl.drawArrays( gl.TRIANGLES, 24, 6 );
    gl.bindTexture(gl.TEXTURE_2D, wallTex);
    gl.drawArrays( gl.TRIANGLES, 6, 18 );
    requestAnimFrame( render );
}

