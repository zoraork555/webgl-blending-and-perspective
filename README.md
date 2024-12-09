# webgl-blending-and-perspective
This program uses base WebGL to create an environment, play with perspective in a 3D space, and work with blending, which is like running a green screen.  

## Description
This program creates an environment to observe. The environment consists of three walls, one to each side and one in front. There is also a floor. On the wall in front there is a window. The window panes have a strong green color on them which the program uses as a chroma key. When this key is found in the fragment shader, the fragment's alpha is set to 0, which makes it transparent. Because of this, the user can see through the window to the outside which has a view of a hellscape. If you want to view more of the hellscape, the arrow keys can be used to adjust the location of the camera. This is limited to twice changed in any direction from start, leaving a 5x5 pattern that can be viewed from.

## Controls
You can use the arrow keys to change the perspective. This is limited to twice in each direction from the starting position, so there is a 5x5 grid that the camera can be positioned at.

## Files
blending.html handles the displaying, input, and webpage formatting of the project  
blending.js implements the WebGL code, creation of assets, rasterizing, and rendering of the project  
The three jpg files are the assets used in the project  
Common folder contains the code from Ed Angel that helps set up and run the WebGL code  

## Running
Download all files as they are stored in the repository. I then run a local server using Servez, a free program, and run the file containing the project. In the Servez window I open the localhost link, and then open blending.html through the localhost tab. The project should now be running.
