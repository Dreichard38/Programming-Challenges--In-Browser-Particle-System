# Programming-Challenges--In-Browser-Particle-System

This is a fairly simple website built in JavaScript that simulates three different types of particles: Snow, Rain, and Flying Bugs. It does this by making use of the canvas HTML element, using JavaScript to paint different objects onto it.

## Building the Code
I didn't use any JavaScript libraries, since I thought that seemed like overkill. Due to the fairly new EMCAScript 6 features, small applications like this don't really require a ton of frameworks to be readable anymore. Running the website is as simple as having the custom.css, ParticleSystemMarkup.html, ParticleSystem.js, and bug.png files in the same directory, then opening ParticleSystemMarkup.html in an EMCAScript 6 compatible browser, like Firefox, Chrome, or Microsoft Edge. 

## Testing the Website
To test the website, click the buttons near the bottom of the screen. The pause button pauses and unpauses the simulation, and the other three buttons toggle between the different types of particles generated on screen.

## Extending the Particle System
It's very simple to build a new type of particle off of this system. Due to the more readable class system built into the EMCAScript 6 standards, it was trivial to build a base class for particles that's easy to build off of. The base class is called Element, and it contains an x and y position, and an x and y velocity, labelled dx and dy. It also contains the functions doFrame() and doRender(), which together takes care of about 90% of what needs to be done.

doFrame() is called on every separate Element each frame, and by default adds dx and dy to the stored x and y values in the object. It then calls the doRender function. If a subclass needs to do something else before rendering, it can override this, and add that functionality to their version of doFrame(). 

doRender() renders the particle, using whatever method you want. This isn't defined in the Element class, since it's a virtual superclass, but this is where the subclasses branch apart to look different. Each subclass can render in a distinct way, using the supplied x and y values for easy positioning. In this case, Snow is rendered using small squares, while Rain is rendered using vertical lines, and Bugs are displayed as small images.

It's not hard to expand on this groundwork, as all you need to do is create a subclass of Element, then add another button to the markup in this form: 
>`<input type="button" value="{Button Name}" class="btn btn-large" onclick="onChangeType({Class Name})" />`

After you do this, if you click the button you added, you should see the newly-defined particles being created on the canvas.
