# Clean-Logic-Simulator (CL-Sim)

CL-Sim is a powerful, yet easy to use logic circuit simulator. It features a clean and visually pleasing user interface, customizable settings, and does not physically hurt to look at. With its simple and straightforward design, Logic simulator is perfect for anyone who wants to learn about or design digital circuits.

![firefox_u2zy1Wg77q](https://user-images.githubusercontent.com/83783716/179404475-4e384dfe-1c06-4e5e-b1ab-400784afe262.png)
![rVKLTGM2Kq](https://user-images.githubusercontent.com/83783716/179404488-21f3bf22-d56f-4d85-8117-aa921804be82.png)


## Translations

CL-Sim will support English UK/US and Polish out of the box, If any one wants to contribute, take a peek [here](https://github.com/GrzegorzManiak/Clean-Logic-Simulator/tree/main/lang/README.md) to figure out how to contribute.

- English UK / US
- Polish

## Engines
CL-Sim was originally designed as a [Scrap mechanic](https://scrapmechanic.com/) Logic simulator, but as the project progressed, I decided to switch lanes and create a more *full* simulator.

Therefor CL-Sim supports the ability to have different types of *Logic simulator Backends*.

There's currently two, both deal with *Switch On* differently.

- [Scrapmechanic-Logic-Engine](https://github.com/GrzegorzManiak/Scrapmechanic-Logic-Engine) For the game [Scrap mechanic](https://scrapmechanic.com/)
- Built in Engine with a more traditional Logisim approach

## Built in Engine
*Could and probably will change in the future*

We work with a *Tick* system, A tick is the amount of time it takes for the simulation to execute one instruction, for our purposes a tick is set to a predetermined amount of time.

E.g, Imagine **A** & **B** are both slaves of an **C** which set to **Low**, When **C** is set to **High** and back to **Low** within two ticks, The engine will see that **C** Has changed to **High** and it will seek to update the child nodes of **C**, Once **C** is set **Low** the engine will seek to update **C**'s child nodes, Sort of in a wave like manner where your circuit is always listening for new connections.

Each gate carries a delay of 1 tick.
 
- Live Mode: Your circuit is constantly evaluated even while you're working on it.
- Toggle Mode: Where the engine stops simulation until its allowed to, meaning that you can work on your project without the engine updating any gates. 
- Tick by Tick: View how your circuit executes tick by tick, helpful for debugging.

## Bugs

If you find a bug, please report it on our [issue tracker](https://github.com/GrzegorzManiak/Clean-Logic-Simulator/issues). Include as much information as possible.

- Enable Developer Settings and create a dump
- Include the steps to reproduce the bug 
- Any screenshots/videos if possible.
