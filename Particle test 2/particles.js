// Adjustable variables
var nodeColor = 'white',
    rColor = true,
    lineColor = 'gray',
    canvasColor = 'cadet blue',
    nodeRadius = 10,
    drawLines = false;


// Node Consructor
function Node(x, y)
{
  this.targX = this.ogX = this.x = x;
  this.targY = this.ogY = this.y = y;
  this.radius = nodeRadius;
  this.color = (rColor == true)? "rgba(" + Math.floor((Math.random() * 200 + 55)) + ", " + Math.floor((Math.random() * 200 + 55))   + ", " + Math.floor((Math.random() * 200 + 55))+ ",1)": nodeColor;
}

Node.prototype.update = function(ev, threshold) 
{
  if(Math.sqrt(Math.pow(this.ogX - ev.mousePos.x, 2) + Math.pow(this.ogY - ev.mousePos.y, 2)) < threshold) 
  {
    var angle = Math.atan2(this.x - ev.mousePos.x, this.y - ev.mousePos.y) - Math.PI /2;
    this.targX = this.ogX + (Math.cos(angle) * threshold);
    this.targY = this.ogY + (Math.sin(-angle) * threshold);
  }
  else 
  {
    this.targX = this.ogX;
    this.targY = this.ogY;
  }

  this.x += (this.targX - this.x) * 0.045;
  this.y += (this.targY - this.y) * 0.045;
};

Node.prototype.render = function(ctx)
{
  ctx.save();
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.color;
  ctx.beginPath();
  ctx.lineWidth = 0;
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
};

// Node Manager Consructor
function NodeManager(n, dw, dh, threshold)
{
  this.n = n;   // Dimensions of field
  this.dw = dw; // Horizontal distance between nodes
  this.dh = dh; // Vertical distance between nodes
  this.threshold = threshold;
  this.nodes = [];
  for(var i = 0; i < n; i++)
  {
    this.nodes.push([]);
    for(var j = 0; j < n; j++)
    {
      this.nodes[i].push(new Node((i * dw) + (dw / 2 ), (j * dh) + (dh / 2)));
    }
  }
}

NodeManager.prototype.update = function (ev)
{
  var that = this;
  this.nodes.forEach(function(row)
  {
    row.forEach(function(node)
    {
      node.update(ev, that.threshold);
    });
  });
};

NodeManager.prototype.render = function(ctx)
{
  this.nodes.forEach(function(row)
  {
    row.forEach(function(node)
    {
      node.render(ctx);
    });
  });
};

NodeManager.prototype.renderLines = function(ctx)
{
  if(drawLines == false) return;
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for(var i = 0; i < this.n; i++)
  {
    for(var j = 0; j < this.n; j++)
    {
      ctx.moveTo(this.nodes[i][j].x, this.nodes[i][j].y);
      try
      {
        ctx.lineTo(this.nodes[i + 1][j].x, this.nodes[i + 1][j].y);
      }
      catch(e){}

      ctx.moveTo(this.nodes[i][j].x, this.nodes[i][j].y);
      try
      {
        ctx.lineTo(this.nodes[i][j + 1].x, this.nodes[i][j + 1].y);
      }
      catch(e){}
    }
  }
  ctx.stroke();
  ctx.restore();
};

// Event Manager Consructor
function EventManager()
{
  this.mousePos = {x: NaN, y: NaN};

  var that = this;

  window.onmousemove = function(e)
  {
    that.mousePos.x = e.clientX;
    that.mousePos.y = e.clientY;
  };
};




// Demo
// ==========

// Event Manager
var ev = new EventManager();

// Node Initialization
var n = 15, // Size of field
    nm = new NodeManager(n, document.body.clientWidth / n, document.body.clientHeight / n, 105);

// Canvas Initialization
var canvas = document.createElement('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');
ctx.globalAlpha = 0.5;


requestAnimationFrame(frame = function()
{
  // Inefficiently clear the canavs... 
  // TODO: Switch to a more efficient method of clearing canvas
  ctx.save();
  ctx.sillStyle = canvasColor;  
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  // Update and render nodes     
  nm.update(ev);
  nm.renderLines(ctx);
  nm.render(ctx);  
  requestAnimationFrame(frame);
});