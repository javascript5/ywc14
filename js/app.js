(function preload(){
  stepsLoaded=0;
  totalSteps=2;
  function loadStep(event){
    stepsLoaded++;
    if(stepsLoaded>=totalSteps) init(); 
  }
  document.addEventListener('DOMContentLoaded',loadStep);
  document.addEventListener('trinipedia.fontsLoaded',loadStep);
  if(fontsHaveLoaded) loadStep();
}());

function init(){
  document.body.style.visibility="visible";
  var canvas=document.querySelector('.HomeBackground');
  var ctx=canvas.getContext('2d');
  var bounds=canvas.getBoundingClientRect();
  var width=bounds.width;
  var height=bounds.height;
  var angle=-0.4;
  var lines=[];
  var bg="#ca281f";
  var color1="#db3824";
  var color2="#82202d";
  var headerBG=document.querySelector('header');
  canvas.width=width;
  canvas.height=height;

  var backgroundColor=bg;
  ctx.fillStyle=backgroundColor;
  ctx.fillRect(0,0,width,height);

  var Point=function(x,y){
    this.x=x;
    this.y=y;
  }

  Point.prototype={
    x:0,
    y:0,
  }

  var Line=function(start,length,thickness,shade,speed){
    this.start=start;
    this.length=length;
    this.thickness=thickness;
    this.shade=shade;
    this.speed=speed;
  }

  Line.prototype={
    start:new Point(0,0),
    length:0,
    phase:0,
    speed:0.001,
    shade:1,
    draw:function(){
      ctx.beginPath();
      var extendThreshold=1;
      var offsetThreshold=0.0;
      var offset=0;
      var lengthP=1;
      var easing=2;
      if(this.phase<extendThreshold){
        lengthP=(this.phase/extendThreshold);
        lengthP=Math.pow(lengthP,1/easing);
      }
      if(this.phase>offsetThreshold){
        offset=(this.phase-offsetThreshold)/(1-offsetThreshold);
        offset=Math.pow(offset,easing);
      }
      var curLength=this.length*lengthP;
      var start=new Point(
        this.start.x+(offset*curLength*(Math.cos(angle))),
        this.start.y+(offset*curLength*(Math.sin(angle)))
      );
      var dest=new Point(
        this.start.x+(curLength*(Math.cos(angle))),
        this.start.y+(curLength*(Math.sin(angle)))
      );

      ctx.moveTo(start.x,start.y);
      ctx.lineTo(dest.x,dest.y);
      ctx.lineWidth=this.thickness;
      ctx.lineCap='round';
      ctx.globalAlpha=1;
      ctx.strokeStyle=bg;
      ctx.stroke();
      ctx.globalAlpha=Math.abs(this.shade);
      ctx.strokeStyle=this.shade>0?color1:color2;
      ctx.stroke();
      ctx.globalAlpha=1;
    },
    update:function(delta){
      this.phase+=this.speed*delta;
    }
  }

  var parallaxLayers=document.querySelectorAll('.Parallax-layer');
  parallaxLayers=Array.prototype.slice.call(parallaxLayers);
  parallaxLayers.forEach(function(layer){
    var start=layer.parentElement.getBoundingClientRect().top+getScroll();
    layer.setAttribute('data-parallax-start',start);
  });

  var businessCanvas=document.querySelector('.BusinessBg');
  var businessCtx=businessCanvas.getContext('2d');
  var businessDimensions=document.querySelector('.SectionTrinipediaForBusiness')
    .getBoundingClientRect();
  var businessStart=businessDimensions.top+getScroll();
  businessCanvas.setAttribute('width',businessDimensions.width);
  businessCanvas.setAttribute('height',businessDimensions.height);

  function generateGraphic(spacing){
    var pointsNum=Math.ceil(businessDimensions.width/spacing)+3;
    var points=[];
    var lastPoint=Math.random();
    for(var i=0;i<pointsNum;i++){
      var newPoint=getNextPoint(lastPoint);
      lastPoint=newPoint;
      points.push(newPoint);
    }
    return points;
  }
  function stepGraphic(points){
    return points.slice(1).concat(getNextPoint(points[points.length-1]));
  }
  function updatePoints(points,offset,spacing){
    if(-offset>=spacing){
      offset+=spacing;
      points=stepGraphic(points);
    }
    return {points:points,offset:offset};
  }
  function getNextPoint(lastPoint){
    var maxDist=0.2;
    var newPoint=lastPoint+((Math.random()<0.5?-1:0.9)*Math.random()*maxDist);
    if(newPoint>1) newPoint=1-(newPoint-1);
    if(newPoint<0) newPoint=-newPoint;
    return newPoint;
  }

  function drawGraphic(points,offset,spacing){
    if(typeof offset=='undefined') offset=0;
    var finalPoints=[];
    businessCtx.beginPath();
    businessCtx.moveTo(-spacing,10+(points[0]*(businessDimensions.height-20)));
    for(var i=1;i<points.length;i++){
      var targetX=-spacing+(i*spacing)+offset;
      var targetY=10+(points[i]*(businessDimensions.height-20));
      businessCtx.lineTo(
        targetX,
        targetY 
      );
      finalPoints.push({x:targetX,y:targetY});
    }
    businessCtx.lineTo(
      businessDimensions.width+100,
      businessDimensions.height+100
    );
    businessCtx.lineTo(
      0-100,
      businessDimensions.height+100
    );
    return finalPoints;
  }

  var spacing1=30;
  var spacing2=90;
  var points1=generateGraphic(spacing1);
  var points2=generateGraphic(spacing2);
  var offset1=0;
  var offset2=0;
  var speed1=0.06;
  var speed2=0.1;
  var sections=Array.prototype.slice.call(document.querySelectorAll('.Section'));
  var sectionsPos=sections.map(function(section){
    return section.getBoundingClientRect().top+getScroll()-(window.innerHeight*0.3);
  });
  var section=0;
  function selectSection(id){
    var cur=document.querySelector('.Navigation a.selected');
    if(cur!=null) cur.classList.remove('selected');
    
    document.querySelector('.Navigation a:nth-child('+(id+1)+')')
      .classList.add('selected');
  }
  selectSection(0);

  var lineChance=0.25;
  var fps=60;
  var frame=1000/fps;
  var lastFrame=0;
  ;(function draw(timestamp){
    var delta=timestamp-lastFrame;
    lastFrame=timestamp;
    var d=delta/frame;
    if(Math.random()<=lineChance){
      var line=new Line(
        new Point(
          -100+Math.random()*(width/4),
          200+height-(Math.random()*500)
        ),
        200+(Math.random()*800),
        Math.random()*70,       // thickness
        -1+(Math.random()*2),          // shade
        0.007+(Math.random()*0.012)      // speed
      );
      lines.push(line);
    }
    ctx.fillRect(0,0,width,height);
    lines.forEach(function(curLine){
      curLine.draw();
      curLine.update(d);
    }); 
    lines=lines.filter(function(curLine){
      return curLine.phase<1;
    });

    for(var i=0;i<parallaxLayers.length;i++){
      var layer=parallaxLayers[i];
      var p=getScroll()-parseFloat(layer.getAttribute('data-parallax-start'));
      var power=parseFloat(layer.getAttribute('data-parallax'))*1;
      layer.style.transform="translate3d(0,"+(-p*power)+"px,0)";
    }
    
    var updatedPoints;
    businessCtx.clearRect(0,0,businessDimensions.width,businessDimensions.height);
    offset1-=speed1*delta;
    updatedPoints=updatePoints(points1,offset1,spacing1);
    offset1=updatedPoints.offset;
    points1=updatedPoints.points;
    drawGraphic(points1,offset1,spacing1);
    businessCtx.fillStyle='#3fbbe1';
    businessCtx.fill();

    offset2-=speed2*delta;
    updatedPoints=updatePoints(points2,offset2,spacing2);
    offset2=updatedPoints.offset;
    points2=updatedPoints.points;
    var destPoints2=drawGraphic(points2,offset2,spacing2);
    businessCtx.strokeStyle='#4bceea';
    businessCtx.lineWidth=6;
    businessCtx.stroke();
    destPoints2.forEach(function(point){
      businessCtx.beginPath();
      businessCtx.arc(point.x,point.y,10,0,Math.PI*2);
      businessCtx.fillStyle='#60f3fb';
      businessCtx.fill();
    });

    var scroll=getScroll();
    var curSection=0;
    for(var i=0;i<sectionsPos.length;i++){
      if(scroll<sectionsPos[i]) break;
      curSection=i;
    }
    if(curSection!=section){
      section=curSection;
      selectSection(section);
    }
    headerBG.style.opacity=Math.min(1,getScroll()*0.001);
    requestAnimationFrame(draw);
  }(frame));

  function getScroll(){
    return window.pageYOffset;
  }

  var carouselItems=document.querySelectorAll('.Carousel-item');
  var carouselContainer=document.querySelector('.Carousel-content');
  carouselItems=Array.prototype.slice.call(carouselItems);

  carouselItems.forEach(function(item,i){
    item.style.left=(i*100)+'vw';
  });
  
  var carouselCurrent=0;
  var carouselLength=carouselItems.length;
  function carouselGo(i){
    carouselContainer.style.transform="translate3d("+(-100*i)+"vw,0,0)";
    carouselCurrent=i;
    var selected=document.querySelector('.Carousel-nav-bullet--selected');
    if(selected != null) selected.classList.remove('Carousel-nav-bullet--selected');
    document.querySelector('.Carousel-nav-bullet:nth-child('+(i+1)+')').classList.add('Carousel-nav-bullet--selected');
    resetCarouselInterval();
  }
  function carouselNext(){
    var next=carouselCurrent+1;
    if(next>=carouselLength) next-=carouselLength;
    carouselGo(next);
  }
  function carouselPrev(){
    var next=carouselCurrent-1;
    if(next<0) next+=carouselLength;
    carouselGo(next);
  }
  var carouselBullets=Array.prototype.slice.call(document.querySelectorAll('.Carousel-nav-bullet'));
  carouselBullets.forEach(function(bullet,i){
    bullet.addEventListener('click',function(event){
      event.preventDefault();
      carouselGo(i);
    });
  });

  document.querySelector('.Carousel-nav-button--next')
    .addEventListener('click',function(event){
      event.preventDefault();
      carouselNext();
    });

  document.querySelector('.Carousel-nav-button--prev')
    .addEventListener('click',function(event){
      event.preventDefault();
      carouselPrev();
    });

  var carouselInterval;
  function startCarouselInterval(){
    carouselInterval=setInterval(carouselNext,3000);
  }
  startCarouselInterval();
  function resetCarouselInterval(){
    clearInterval(carouselInterval);
    startCarouselInterval();
  }

  var menu=document.querySelector('.Menu');
  var menuButtons=Array.prototype.slice.call(
    document.querySelectorAll('.MenuButton')
  );
  menuButtons.forEach(function(button){
    button.addEventListener('click',function(event){
      event.preventDefault();
      toggleMenu();
    })
  });
  var menuLinks=Array.prototype.slice.call(
    document.querySelectorAll('.MenuLink')
  );
  menuLinks.forEach(function(link){
    link.addEventListener('click',function(event){
      toggleMenu();
    })
  });


  var isMenuOpen=false;
  function toggleMenu(){
    isMenuOpen=!isMenuOpen;
    if(isMenuOpen){
      menu.classList.add('Menu--opened'); 
    }else{
      menu.classList.remove('Menu--opened'); 
    }
  }
  document.querySelector('.VideoPlayer-button').addEventListener('click',function(event){
    event.preventDefault();
    var parent=event.target.parentElement;
    event.target.remove();
    parent.innerHTML='<iframe src="https://player.vimeo.com/video/179919582?autoplay=1" width="901" height="506" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
  });
}