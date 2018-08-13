class Game
{
  constructor()
  {
    createCanvas(800, 800);
    this.obs = [];
    this.cycles = 0;
    this.obstacleRate = 150;
    this.score = 0;

    this.population = new Population(0.1, 150, this.obs);

  }

  getObstacles()
  {
    return this.obs;
  }

  resetObsacles()
  {
    this.obs = [];
    this.cycles = 0;
    this.obstacleRate = 150;
    this.score = 0;
  }

  draw()
  {
    background(0, 237, 255);

    this.population.draw();
    this.population.drawDebug();
    for (var o of this.obs)
    {
      o.draw();
    }
    fill(255);
  }

  update()
  {
    this.population.update();
    this.population.generate();
    this.population.calculateFitness();

    for (var o of this.obs)
    {
      o.update();
    }

    this.manageObstacles();
  }



  manageObstacles()
  {
    if (this.obs.length <= 0)
    {
      this.obs.push(new Obstacle());
    }
    else
    {

      this.cycles++;

      var newObs = [];
      for (var o of this.obs)
      {
        if (o.x + o.w > 0)
        {
          newObs.push(o);
        }
      }

      if ((this.cycles % this.obstacleRate) == 0)
        newObs.push(new Obstacle());

      this.obs = newObs;
    }
  }

}