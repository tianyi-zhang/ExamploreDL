# ExamploreDL
A neural network analysis and visualization framework that enables programmers to compare and contrast multiple neural networks and explore design decision made by other programmers.

# Installing and running on a local machine
1. Download and install [MAFFT](https://mafft.cbrc.jp/alignment/software/) on your local;
2. Using *pip* to install the **flask** package by typing `pip install flask` on the terminal;
3. Go to the `./ExamploreDL/interface/` folder using `cd ./ExamploreDL/interface/`;
4. Enter `flask run` to run our project;
5. Follow the information displayed on the terminal, and then open the link on the browser.


# Running in Docker
[Install Docker and start the Docker service locally](https://docs.docker.com/engine/install/), then run the following commands from the ExamploreDL directory to launch the docker container. 

`docker build . -t examploredl`

The command above creates the docker image based on the `Dockerfile` in the repo. It tags the image with the name `examplordel` so that it can be easily referenced.

`docker run -p 0.0.0.0:8080:5000 --name examploredl examploredl`

The command above creates a running instance of the examploredl image. The `-p` flag maps port `8080` on the host machine to port `5000` in the docker container. This is the default port for Flask. It also names the container examploredl, again for ease of reference. 

You will then be able to access the application in your browser at `localhost:8080`.

**NOTE**: this launches the application in development mode. This is NOT recommended for production as the Flask development server is considered insecure.

To stop the container, run the following command:

`docker stop examploredl`

To start the stopped image, run the following command:

`docker start examploredl`

