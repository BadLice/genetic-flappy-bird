class Player
{
  constructor(childDNA)
  {
    //[0] -> max y distance from target when jump, [1] -> multiplier of y of next obstacle, [2] -> maxSpeed
    this.dna = [];
    if (childDNA)
    {
      for (var i = 0; i < childDNA.length; i++)
      {
        this.dna[i] = childDNA[i];
      }
    }
    else
    {
      this.dna = [random(1), random(1), random(1)];
    }

    this.fitness = 0;
    this.prob = 0;

    this.w = 20;
    this.canJump = true;
    this.started = true;
    this.dead = false;
    this.maxSpeed = map(this.dna[2], 0, 1, 0, 20);
    this.position = createVector(200, height / 2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.gravity = createVector(0, this.maxSpeed / 10);
    this.angle = radians(0);

    this.color = color(255, 242, 0);

    this.nextObstacle = undefined;
    this.target = 0;
    this.change = false;

  }

  draw(col)
  {
    push();
    stroke(0);
    if (col)
      fill(col);
    else
      fill(this.color);
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    beginShape(TRIANGLES);
    vertex(this.w, 0);
    vertex(-this.w, this.w);
    vertex(-this.w, -this.w);
    endShape(CLOSE);
    fill(0)
    rotate(-this.angle);
    text(this.fitness, 0, 0);
    pop();
  }

  update()
  {
    this.die();
    this.move();
    this.control();
    this.setNextObstacle();
  }

  die()
  {
    if (this.position.y >= height + this.w)
    {
      this.dead = true;
    }

    var obs = game.getObstacles();
    for (var o of obs)
    {
      if (this.position.x >= o.x && this.position.x <= o.x + o.w)
        if (this.position.y <= o.y || this.position.y >= o.y + o.h)
          this.dead = true;
    }

    if (this.dead) this.nextObstacle = undefined;

  }

  control()
  {
    //key control
    //   if (keyIsPressed || mouseIsPressed)
    //   {
    //     if (this.canJump)
    //     {
    //       if (keyCode == 32 || mouseIsPressed)
    //       {
    //         this.started = true;
    //         this.canJump = false;
    //         this.jump();
    //       }
    //     }
    //   }
    //   else
    //   {
    //     this.canJump = true;
    //   }

    if (this.jumpTrigger())
    {
      if (this.canJump)
      {
        this.started = true;
        this.canJump = false;
        this.jump();
      }
    }
    else
    {
      this.canJump = true;
    }

  }

  jumpTrigger()
  {
    if (this.nextObstacle)
    {
      var target = map(this.dna[1], 0, 1, -1, 1) * this.nextObstacle.y;

      var d = map(this.dna[0], 0, 1, 0, height);

      return ((this.position.y - target) >= d && this.canJump);
    }
    else
    {
      return false;
    }
  }

  setNextObstacle()
  {
    var prec = this.nextObstacle;
    var obs = game.getObstacles()
    for (var o of obs)
    {
      if (o.x + o.w >= this.position.x)
      {
        this.nextObstacle = o;
        break;
      }
    }

    if (this.nextObstacle !== prec && prec)
      this.change = true;
  }


  move()
  {

    if (this.started)
    {
      this.acceleration.add(this.gravity);
      this.velocity.add(this.acceleration);
      this.velocity.limit(7);
      this.position.add(this.velocity);

      this.angle = map(this.velocity.y, -7, 7, radians(-45), radians(45));

      //limit the player at the top of the screen
      if (this.position.y < -this.w * 2)
      {
        this.position.y = -this.w * 2;
      }
    }
  }

  jump()
  {
    this.jumped = true;
    this.acceleration = createVector(0, -this.maxSpeed);
  }

  crossover(parent)
  {
    var r = floor(random(this.dna.length));
    var childDNA = [];

    for (var i = 0; i < this.dna.length; i++)
    {
      if (i < r)
        childDNA[i] = this.dna[i];
      else
        childDNA[i] = parent.dna[i];
    }
    return childDNA;
  }

  mutate(mr)
  {
    for (var i = 0; i < this.dna.length; i++)
    {
      if (random(1) < mr)
        this.dna[i] = random(1);
    }
  }

  calculateFitness()
  {
    if (this.change && !this.dead)
    {
      this.fitness++;
      this.change = false;
    }
  }

}