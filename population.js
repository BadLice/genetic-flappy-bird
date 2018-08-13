class Population
{
  constructor(mutationRate, maxPop, obs)
  {
    this.population = [];
    this.generation = 1;
    this.mutationRate = mutationRate;
    this.finished = false;
    this.velocity = 1;
    this.maxPop = maxPop
    this.maxFit = 5;
    this.bestEver = 0;

    for (var i = 0; i < this.maxPop; i++)
    {
      this.population.push(new Player());
    }

  }

  naturalSelection()
  {
    var sum = 0;
    for (var o of this.population)
    {
      sum += o.fitness;
    }
    //normalizing the probability into the range 0-1
    for (var i = 0; i < this.population.length; i++)
    {
      this.population[i].prob = this.population[i].fitness / sum;
    }
  }

  updateBest5()
  {
    if (this.generation % 5 == 0)
    {
      if (this.best5.length >= this.maxHighlights)
      {
        this.best5.splice(0, 1);
      }
      this.best5.push(new Player(this.currentMax().nMoves, this.currentMax().dna, this.generation));
    }
  }

  showHighLihts()
  {
    this.highlights = true;
    this.tempPop = this.population;
    this.highlightsIndex = 0;
    this.nextHighlight();
  }

  nextHighlight()
  {
    this.draw();
    this.delay = true;
    //finished highlights
    if (this.highlightsIndex >= this.best5.length)
    {
      this.highlights = false;
      this.population = this.tempPop;
      for (var i = 0; i < this.best5.length; i++)
      {
        this.best5[i] = new Player(this.best5[i].nMoves, this.best5[i].dna, this.best5[i].generation);
      }

      for (var i = 0; i < this.population.length; i++)
      {
        this.population[i] = new Player(this.population[i].nMoves, this.population[i].dna);
      }
      return;
    }

    this.population = [];
    this.population.push(this.best5[this.highlightsIndex]);
    this.highlightsIndex++;
    initRoads();

  }

  generate()
  {
    if (this.finishedGeneration())
    {
      if (!this.highlights)
      {
        var newPop = []
        for (var i = 0; i < this.population.length; i++)
        {
          //normalizes the probability
          this.naturalSelection();

          var parent1 = this.pickOne();
          var parent2 = this.pickOne();

          var childDNA = parent1.crossover(parent2);


          var child = new Player(childDNA);
          child.mutate(this.mutationRate);

          newPop[i] = child;

        }
        this.population = newPop;
        this.generation++;
        game.resetObsacles();
      }
      else
      {
        this.nextHighlight();
      }
    }
  }

  finishedGeneration()
  {
    var finished = true;
    for (var o of this.population)
    {
      if (!o.dead)
      {
        finished = false;
      }
    }

    return finished;
  }

  calculateFitness()
  {
    for (var i = 0; i < this.population.length; i++)
    {
      if (!this.finished)
        this.population[i].calculateFitness();
    }
  }

  maxFitness()
  {
    let maxFitness = 0;
    for (let i = 0; i < this.population.length; i++)
    {
      if (this.population[i].fitness > maxFitness)
      {
        maxFitness = this.population[i].fitness;
      }
    }
    return maxFitness;
  }

  currentMax()
  {
    let maxFitness = -1;
    var current;
    for (let i = 0; i < this.population.length; i++)
    {
      if (this.population[i].fitness > maxFitness)
      {
        maxFitness = this.population[i].fitness;
        current = this.population[i];
      }
    }
    return current;
  }

  drawDebug()
  {
    textSize(20);
    fill(0);
    stroke(0);
    text("Generation: " + this.generation, 10, 15);
    text("Best: " + this.bestEver, 10, 35);

  }

  draw()
  {

    for (var o of this.population)
    {
      if (!o.dead)
        o.draw();
    }

    var cm = this.currentMax();
    if (cm.dead)
      cm.draw(color(0, 0, 255));
    else
      cm.draw(color(0, 255, 0));

    if (cm.fitness > this.bestEver)
      this.bestEver = cm.fitness;
  }

  update()
  {
    for (var i = 0; i < this.velocity; i++)
    {
      for (var o of this.population)
      {
        if (!o.dead)
        {
          o.update();
        }
      }
    }

    this.limitFitness();
  }

  limitFitness()
  {
    var up = false;
    for (var i = 0; i < this.population.length; i++)
    {
      if (this.population[i].fitness > this.maxFit)
      {
        up = true;
        this.population[i].fitness *= 10;
        this.population[i].dead = true;
      }
    }
    if (up)
      this.maxFit++;
  }

  //pick one element of the population basing on its fitness and so to its probability
  pickOne()
  {
    var select = 0;
    var selector = Math.random();
    while (selector > 0)
    {
      selector -= this.population[select].prob;
      select++;
    }
    select--;
    return this.population[select];
  }
}