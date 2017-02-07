require('konva');

var app = { run: function() {

var width = 800;
var height = 610;
var circleDiameter = 90;
var circleSpace = 100;
var circleFillColor = 'rgb(201,200,184)'//'rgba(254,255,173,0.8)';
var circleDropColor = '#FFF';//'#DAD7C5';
var circleHoverColor = '#EEE';//'rgb(117,128,194)';
var circleStrokeColor = 'black';

var circleFocusDiameter = 300;

var buttonLabelColor = 'rgb(117,128,194)';
var buttonFillColor = circleFillColor;
var buttonHoverColor = circleDropColor;
var buttonClickColor = 'orange';

var interactableThresholdOpacity = 0.8;

var topOffset = -35;
var problemPosFormula = 'stage.width() - (circleDiameter * 5)';
var cctXPos = 'iconWidth / 4';
var cctYPos = 'iconWidth / 4';

var iconWidth = 90;
var iconHeight = 90;
var iconHomeScale = 0.75;
var iconHSpacing = 'iconWidth * 0.6';
var iconVSpacing = 'iconHeight * 0.8';
var iconsPerRow = 1;

var containerFill = circleHoverColor;//'rgb(201,200,184)';
var containerStroke = 'black';
var containerHeight = 375;
var containerWidth = iconWidth - (iconWidth * 0.25);

var rightLabelOffset = - (circleSpace / 2);
var scrollDistance = circleDiameter;
var urlBase = '';//'/test/meiosis/'

var focusedEgg = null;
var focusPositionX = 310;
var focusPositionY = 255;
var textEggLabels = [ {x: -67, y: (circleSpace / 2), text: 'Precursor Germ cells'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Prophase I\n  (2n = 4)'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Metaphase I'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Anaphase I'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Telophase I'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: ''},
                      {x: circleSpace + rightLabelOffset, y: -30, text: 'Cytokinesis\n (n = 2)'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: ''},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Prophase II\n  (n = 2)'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: ''},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Metaphase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: ''},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Anaphase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: ''},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Telophase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: ''},
                      {x: circleSpace + rightLabelOffset, y: 0, text: ''},
                      {x: circleSpace + rightLabelOffset, y: 0, text: ''},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Cytokinesis\n (n = 2)'},
                    ]

var imageSources = {
                    precursor: 'img/Precursor-Germ-Cell.png',
                    sequences: {
                      PROPHASE_I:  {
                        icons: [  'img/Prophase-1.png',
                                  'img/X-version-Prophase-1.png',
                                  'img/X-version-Precursor-Germ-Cell.png']
                      },
                       METAPHASE_I:  {
                          icons: [ 'img/Metaphase-1.png']
                      },
                       ANAPHASE_I:  {
                          icons: [ 'img/Anaphase-1.png']
                     },
                       TELOPHASE_I:  {
                          icons: [ 'img/Telophase-1.png']
                     },
                     CYTOKINESIS_A:  {
                          icons: [ 'img/A. Cytokinesis.png',
                                  'img/B. Cytokinesis.png']
                     },
                     CYTOKINESIS_B:  {
                        icons: [ 'img/A. Cytokinesis.png',
                                'img/B. Cytokinesis.png']
                    }
                   }
                };

app.sequences = [ null,
               'PROPHASE_I',
               'METAPHASE_I',
               'ANAPHASE_I',
               'TELOPHASE_I',
               'CYTOKINESIS_A',
               'CYTOKINESIS_B',
               'PROPHASE_II',
               'METAPHASE_II',
               'ANAPHASE_II',
               'TELOPHASE_II',
               'CYTOKINESIS_C',
               'CYTOKINESIS_D',
               'CYTOKINESIS_E',
               'CYTOKINESIS_F',
             ];

var loadCount = [];

var stage = new Konva.Stage({
    container: '#container',
    width: width,
    height: height
});

var stageCenter = stage.width() / 2;

var layer = new Konva.Layer({name: 'eggLayer'});

var tempLayer = new Konva.Layer({name: 'dragLayer'});

var staticLayer = new Konva.Layer({name: 'staticLayer'});

var focusLayer = new Konva.Layer({name: 'focusLayer'});

var undoHistory = [];

var debug = false;

var ui = {

setEggLabel: function(i, x, y) {
  if(! textEggLabels[i] || textEggLabels[i].text.length == 0) return false;

  var text = new Konva.Text({
      fill : 'black',
      x: x + textEggLabels[i].x,
      y: y + textEggLabels[i].y,
      fontSize: '14'
  });

  text.text(textEggLabels[i].text);

  layer.add(text);

  ui.debugRect(x + textEggLabels[i].x, y + textEggLabels[i].y, text.getWidth(), text.getHeight())
},

undo: function() {
    var egg = undoHistory[undoHistory.length-1];

    if(egg) {
        ui.clearIconMenu();

        if(egg.chromos.length > 0) {
          var ret = egg.chromos.pop();
          ui.returnToContainer(ret);
        }

        if(egg.chromos.length === 0) {
                undoHistory.pop();

                ui.resetMenuOptions(egg.sequence && egg.sequence > 0 ? egg.sequence : 1);

                egg.fill(circleFillColor);
                egg.opacity(1.0);

                if(egg.prev && !egg.prev.isPrecursor) {
                    egg.prev.opacity(1.0);
                    ui.toggleAllIconsDraggable(egg.prev, true);
                }
                if(egg.next) {
                    egg.next.opacity(0.4);
                    ui.toggleAllIconsDraggable(egg.next, false);
                }

                layer.draw();

                ui.focus(egg.next, { focusOut: true,
                                onComplete: function() {
                                      ui.focus(egg, {
                                            focusOut: false,
                                            reverseScroll: true
                                          });
                                }
                              }
                          );
        }
    }
},

debugRect: function(x, y, w, h) {
    if(! debug) return false;

    var rect = new Konva.Rect({
        stroke: 'black',
        x: x - 5,
        y: y - 5,
        width: w + 10,
        height: h + 10
    });

    layer.add(rect);
},

isIcon: function(val) {
//  console.log('isIcon? ');
//  console.log(val);
    return typeof val.getUIComponentType === 'function' &&
    val.getUIComponentType() === 'icon';
},

unPlacedIcon: function(val) {
//  console.log(val);
//  console.log('place? >>> '+val.isPlaced());
    return typeof val.isPlaced === 'function' &&
    val.isPlaced() !== true;
},

getIcons: function(aLayer) {
    var aLayer = aLayer || layer;
    var icons = aLayer.children.filter(ui.isIcon);
    return icons;
},

getOrphanedIcons: function(aLayer) {
    var aLayer = aLayer || layer;
    var icons = aLayer.children.filter(ui.isIcon);
  //  console.log(icons);
    var pi = icons.filter(ui.unPlacedIcon);
    return pi;
},

allIconsPlaced: function() {
    return ui.getOrphanedIcons().length === 0;
},

clearIcons: function(aLayer) {
    var aLayer = aLayer || layer;
    var icons = aLayer.children.filter(ui.isIcon);

    icons.forEach(function(icon) {
        icon.destroy();
    });
},

clearIconMenu: function(aLayer) {
    var aLayer = aLayer || staticLayer;

    var icons = aLayer.children.filter(ui.isIcon);
  //  var orphanedIcons = {values: icons.filter(ui.unPlacedIcon)};

    ui.getOrphanedIcons(aLayer).forEach(function(icon) {
        icon.hide();
    });

    //staticLayer.draw();
},

moveIcons: function(layer1, layer2) {

    ui.getOrphanedIcons(layer1).forEach(function(icon)
      {
        console.log('moving icon '+icon.name()+' from '+layer1.name()+'  to '+layer2.name());
          icon.moveTo(layer2);
          icon.moveToTop();
      });
},

toggleAllIconsDraggable: function(egg, draggable) {
  if(!egg || !egg.chromos) return false;

  if(! typeof draggable === 'boolean') {
      draggable = true;
  }

  egg.chromos.forEach(function(chrom) {
      chrom.draggable(draggable);
  });
},

placeInEgg: function(egg, sizeChangeOnDrop) {
    sizeChangeOnDrop = sizeChangeOnDrop || 1.2;

    var w = currentDragObject.getWidth();
    var h = currentDragObject.getHeight();

    if(sizeChangeOnDrop) {
        if(w > iconWidth) {
            w = iconWidth;
        }

        if(h > iconHeight) {
            h = iconHeight;
        }

        w = w * sizeChangeOnDrop;
        h = h * sizeChangeOnDrop;
    }

    currentDragObject.setWidth(w);
    currentDragObject.setHeight(h);

    var prevEgg = egg.prev;

    if(prevEgg) {
        if(prevEgg.chromos.length > 0 || prevEgg.isPrecursor) {
              if(egg.next && egg.next === currentDragObject.inEgg) {
                    return false;
              }

              if(! prevEgg.isPrecursor) {
                  prevEgg.opacity(0.4);

                  ui.toggleAllIconsDraggable(prevEgg, false);
              }

              if(ui.allIconsPlaced()) {
                  ui.toggleAllIconsDraggable(egg, true);
              }

              egg.chromos.push(currentDragObject);
              currentDragObject.inEgg = egg;

              if(! egg.isPrecursor) undoHistory.push(egg);

            //  if(! allIconsPlaced()) { currentDragObject.setPlaced(true); }
              currentDragObject.setPlaced(true);

              if(egg.next) {
                      egg.next.opacity(1.0);
                      /*ui.focus(egg,  { focusOut: true,
                                      onComplete: function() {
                                            ui.focus(egg.next);
                                      }
                                    });*/
              }
        }

        if(! prevEgg.isPrecursor && prevEgg.chromos.length == 0) {
              if(currentDragObject.inEgg) {
                  currentDragObject.inEgg.chromos.remove(currentDragObject);
                  currentDragObject.inEgg.opacity(0.4);
              }

              currentDragObject.setX(prevEgg.x() - circleDiameter / 2);
              currentDragObject.setY(prevEgg.y() - circleDiameter / 2);

              prevEgg.opacity(1.0);

              if(prevEgg.next) {
                  prevEgg.next.opacity(1.0);
                  prevEgg.next.fill(circleFillColor);
              }

              ui.placeInEgg(prevEgg);
        }
    } /*else {
          if(egg.next) {
              egg.next.opacity(1.0);
              ui.focus(egg,  { focusOut: true,
                              onComplete: function() {
                                    ui.focus(egg.next);
                              }
                            });
          }
    }*/

    ui.checkForEmptyEgg(egg);

    if(egg.next) {
      //egg.moveTo(tempLayer);
      egg.moveToBottom();

        ui.updateIcons(egg.next.sequence);
        ui.focus(egg, {focusOut: true,
                          onComplete: function() {
                            ui.focus(egg.next, {focusOut: false});
                            egg.next.moveToTop();
                          }});

    }

    return true;
},

scrollPage: function(egg) {
      ui.moveIcons(layer, tempLayer);

      tempLayer.draw();
      layer.draw();
      var layerCentre = (layer.y() / 2);
      var y =  layerCentre < egg.y() ? -egg.y() : egg.y();

        app.tween = new Konva.Tween({
          node: layer,
          duration: 0.5,
          y: y,
          opacity: 1,
          onFinish: function() {
              ui.moveIcons(tempLayer, layer);

              layer.draw();
              tempLayer.draw();
          }
      });

      if(app.timeout)
        clearTimeout(app.timeout);
      // start tween after 2 seconds
      app.timeout = setTimeout(function() {
          app.tween.play();
      }, 0);

      //focusedEgg.moveTo(layer);
},

/*doScroll: function(direction) {
  //var isUndo = isUndo || false;
  if(egg && egg.scrollPageOnDrop !== null) {
      ui.scrollPage(direction);
      //scrollOnReady(direction, egg.sequence);

    //  egg.scrollPageOnDrop = egg.scrollPageOnDrop === 'down' ? 'up' : 'down';
  }
},*/
returnToContainer: function(icon, scaled) {
  scaled = scaled || 1.0;

  if(icon.getWidth() !== iconWidth) {
      icon.setWidth(iconWidth * scaled);
  }

  if(icon.getHeight() !== iconHeight) {
      icon.setHeight(iconHeight * scaled);
  }

  icon.moveTo(layer);

  //var index = Number(icon.name().split('_')[1]);

  icon.setX(icon.getHomePos().x);
  icon.setY(icon.getHomePos().y);

  layer.draw();
  tempLayer.draw();

  if(icon.inEgg) {
    icon.inEgg.chromos.remove(currentDragObject);
    ui.checkForEmptyEgg(icon.inEgg);
  }

  icon.setPlaced(false);

  if(icon.inEgg && icon.inEgg.prev) {
      ui.updateIcons(icon.inEgg.prev.sequence);
  }

  //ui.doScroll(icon.inEgg);

  icon.inEgg = null;
},

checkForEmptyEgg: function(egg) {
  if(egg.chromos.length == 0) {
          egg.fill(circleFillColor);
          if(egg.next) {
                egg.next.opacity(0.4);
          }
          if(egg.prev) {
                egg.prev.opacity(1.0);

                egg.prev.chromos.forEach(function(chrom) {
                    chrom.draggable(true);
                    //layer.draw();
                });
          }
  }
},

resetMenuOptions: function(sequence) {
    ui.updateIcons(sequence);
},
icon: {
        images: null,
        konvaWrappers: null,
        init: function() {
            ui.icon.konvaWrappers = {};
            app.sequences.forEach(function(s) {
              if(s) {
                  ui.icon.konvaWrappers[String(s)] = [];
              }
            });
        }
  },
updateIcons: function(sequence) {

var seqStr = app.sequences[sequence];
loadCount[seqStr] = 0;

if(! imageSources.sequences[seqStr] ) return false;

if(! ui.icon.konvaWrappers) {
    ui.icon.init();
}

ui.clearIconMenu();

if(ui.icon.konvaWrappers[seqStr].length === 0) {

  var xchromPos = eval(cctXPos) - (eval(iconHSpacing) * 0.075);
  var ychromPos = eval(cctYPos);// + (eval(iconVSpacing) * 0.015);
  var vSpace = eval(iconVSpacing);
  var hSpace = eval(cctXPos) - (eval(iconHSpacing) * 0.075);

ui.icon.images = ui.icon.images || {};
ui.icon.images[seqStr] = ui.icon.images[seqStr] || [];

imageSources.sequences[seqStr].icons.forEach(function(src, inx) {

  ui.icon.images[seqStr][inx] = new Image();

  ui.icon.konvaWrappers[seqStr][inx] = new Konva.Image({
        x: xchromPos,
        y: ychromPos,
        image: ui.icon.images[seqStr][inx],
        width: iconWidth * iconHomeScale,
        height: iconHeight * iconHomeScale,
        name: 'chromosome_'+inx,
        draggable: true,
        fill: 'transparent'
  });

  ui.icon.konvaWrappers[seqStr][inx].sequence = sequence;

  ui.icon.konvaWrappers[seqStr][inx].setHomePos({x: xchromPos, y: ychromPos});
  ui.icon.konvaWrappers[seqStr][inx].setUIComponentType('icon');

  ui.icon.images[seqStr][inx].onload = function(e) {
        loadCount[seqStr] = loadCount[seqStr] + 1;
        staticLayer.add(ui.icon.konvaWrappers[seqStr][inx]);
        staticLayer.draw();
  };

  xchromPos += eval(iconHSpacing);

  ychromPos += ((inx + 1) % iconsPerRow) == 0 ? vSpace : 0;
  xchromPos = ((inx + 1) % iconsPerRow) === 0 ? hSpace : xchromPos;
  });

  ui.icon.images[seqStr].forEach(function(img, inx) {
      ui.icon.images[seqStr][inx].src = urlBase + imageSources.sequences[seqStr].icons[inx];
  });
} else {
    ui.icon.konvaWrappers[seqStr].forEach(function(icon) {
          icon.show();
    });

    staticLayer.draw();
}

if(focusedEgg.startingPosition && sequence == 1) {
    ui.focus(focusedEgg);
}
},
focus: function(thisEgg, params) {
  if(!thisEgg.startingPosition) return false;

  if(!params) {
      params = {
            focusOut: false,
            onComplete: null,
            reverseScroll: false
        };
  }

  if(!thisEgg) return false;

  var x;
  var y;

  x = params.focusOut ? thisEgg.startingPosition.x : focusPositionX;
  y = params.focusOut ? thisEgg.startingPosition.y : focusPositionY;

  if(params.focusOut) {
      thisEgg.moveTo(layer);
  } else {
      thisEgg.moveTo(focusLayer);
  }

  focusLayer.moveToTop();
  thisEgg.x(x);
  thisEgg.y(y);
  thisEgg.opacity(1);
  thisEgg.moveToTop();

  ui.scrollPage(params.reverseScroll ? thisEgg.prev : thisEgg.next);

  var tween = new Konva.Tween({
    node: thisEgg,
    duration: 0.5,
  //  easing: Konva.Easings.BackEaseIn,
    width: params.focusOut ? circleDiameter : circleFocusDiameter,
    height: params.focusOut ? circleDiameter : circleFocusDiameter,
    fill: '#FFF',
    onFinish: function() {
        layer.draw();
        tempLayer.draw();
        if(params.onComplete) {
              params.onComplete();
        }
    }
  });

  // start tween after 2 seconds
  setTimeout(function() {
      tween.play();
  }, 50);

  focusedEgg = thisEgg;

  return this;
},

setPrototypes: function() {

Array.prototype.remove = function (v) {
  if (this.indexOf(v) != -1) {
      this.splice(this.indexOf(v), 1);
      return true;
  }
return false;
}

// icon settings
Konva.Image.prototype.setHomePos = function(params) {
        this.iconPos = params;
};

Konva.Image.prototype.getHomePos = function() {
        return this.iconPos;
};

Konva.Image.prototype.setPlaced = function(placed) {
        return this.placed = placed;
};

Konva.Image.prototype.isPlaced = function() {
        return this.placed;
};

Konva.Image.prototype.setUIComponentType = function(type) {
         this.uiComponentType = type;
};

Konva.Image.prototype.getUIComponentType = function() {
        return this.uiComponentType;
};
Konva.Node.prototype.sequence = 0;
// button functions
Konva.Rect.prototype.setUIComponentType = function(type) {
         this.uiComponentType = type;
};

Konva.Rect.prototype.getUIComponentType = function() {
        return this.uiComponentType;
};

// egg settings
Konva.Circle.prototype.initEgg = function(params) {
        this.chromos = params.chromos;
        this.next = params.next;
        this.prev = params.prev;
        this.startingPosition = {x: params.x, y: params.y}
};

Konva.Circle.prototype.emptyChromos = function() {
        if(!this.chromos) return false;

        var seq = this.sequence;
        var chromos = this.chromos;
        this.chromos.forEach(function(icon, i){

            icon.hide();
            ui.resetMenuOptions(seq);

            if(chromos && chromos[i]) {
                delete(chromos[i]);
            }
        });
};

Konva.Circle.prototype.isPrecursor = false;
Konva.Circle.prototype.scrollPageOnDrop = null;
}
}

ui.setPrototypes();

app.sequences.forEach(function(el, key) {
  if(el !== null) {
      loadCount[el] = 0;
  }
});

//staticLayer.clearBeforeDraw(false);
//staticLayer.draw();

var text = new Konva.Text({
    fill : 'black'
});

layer.add(text);

// setup chromosome container
var chromosomeContainer = new Konva.Rect({
      x: eval(cctXPos),
      y: eval(cctYPos),
      width: containerWidth,
      height: containerHeight,
      fill: containerFill,
      stroke: containerStroke,
      strokeWidth: 1,
      name: 'container',
});

var undoIcon = new Konva.Rect({
  x: eval(cctXPos) + containerWidth / 6,
  y: eval(cctYPos) + topOffset + circleDiameter * 3 + 50,
  width: iconWidth / 2,
  height: iconHeight / 3,
  fill: containerFill,
  stroke: containerStroke,
  strokeWidth: 2,
  name: 'undo',
  type: 'icon'
});

var undoText = new Konva.Text({
  x: eval(cctXPos) + containerWidth / 6 + 2,
  y: eval(cctYPos) + topOffset + circleDiameter * 3 + 54,
    fill : 'black',
    text: 'Undo',
    fontSize: 18,
     fontFamily: 'Calibri',
     fill: buttonLabelColor
});

var resetIcon = new Konva.Rect({
  x: eval(cctXPos) + containerWidth / 6,
  y: eval(cctYPos) + topOffset + circleDiameter * 3 + 85,
  width: iconWidth / 2,
  height: iconHeight / 3,
  fill: containerFill,
  stroke: containerStroke,
  strokeWidth: 2,
  name: 'reset',
  opacity: 0.4,
});

resetIcon.setUIComponentType('button');
undoIcon.setUIComponentType('button');

var resetText = new Konva.Text({
  x: eval(cctXPos) + containerWidth / 6 + 2,
  y: eval(cctYPos) + topOffset + circleDiameter * 3 + 89,
    fill : 'black',
    text: 'Reset',
    fontSize: 18,
     fontFamily: 'Calibri',
     fill: buttonLabelColor,
     opacity: 0.4
});

staticLayer.add(chromosomeContainer);
chromosomeContainer.setListening(false);

staticLayer.add(undoIcon);
staticLayer.add(undoText);

undoText.setListening(false);

staticLayer.add(resetIcon);
staticLayer.add(resetText);

resetText.setListening(false);



    // setup egg interface
    var yoff = 0;
    var opacity;
    var eggMap = [];
    var precursorImg = new Image();
    var precursor;
    var previousEgg;

    for (var i = 0; i < 19; i++) {
        var x;
        var y;

        if(i == 0) {
              x = eval(problemPosFormula) - (circleDiameter * 2);
              y = circleDiameter + topOffset;

              var pX = x; // create local instance
              var pY = y;

              precursorImg.onload = function() {
                    precursor = new Konva.Image({
                          x: pX - (circleDiameter / 2),
                          y: pY - (circleDiameter / 2),
                          image: precursorImg,
                          width: iconWidth,
                          height: iconHeight,
                          name: 'precursor_'+i,
                          fill: 'transparent'
                    });

                    precursor.setUIComponentType('stillImage');
                    layer.add(precursor);
                  //  stage.add(layer);
              };

        } else if(i < 5) {
           x = eval(problemPosFormula) - (circleDiameter / 2);
           y = circleDiameter + yoff + topOffset;
           yoff += circleSpace;
        } else if(i < 16 && i % 2 == 1) {
           x = eval(problemPosFormula)  - circleDiameter * 1.5;
           y = circleDiameter + yoff + topOffset;;
        } else if(i < 16 && i % 2 == 0) {
          x = eval(problemPosFormula) + circleDiameter / 2;

          yoff += circleSpace;
        } else if(i == 16) {
          x = eval(problemPosFormula) - circleDiameter * 2.8;
          y = circleDiameter + yoff + topOffset;
        } else if(i == 17) {
          x = eval(problemPosFormula) - circleDiameter * 0.2;
        } else if(i == 18) {
          x = eval(problemPosFormula) + circleDiameter * 1.2;
        }

        ui.setEggLabel(i, x, y);

        opacity = i > 1 ? 0.4 : 1.0;

        var egg = new Konva.Circle({
            x : x,
            y : y,
            radius: (circleDiameter / 2),
            stroke: circleStrokeColor,
            name : 'egg_' + i,
            opacity: opacity,
            fill: i < 1 ? circleDropColor : circleFillColor,
        });

        egg.isPrecursor = i < 1;
        egg.sequence = i == 5 || i == 6 ? 5 : i;
        egg.scrollPageOnDrop = 'down';

        layer.add(egg);

        egg.initEgg({next: null, prev:  previousEgg, chromos: [], x: x, y: y});

        if(previousEgg && egg) {
          previousEgg.next = egg;
        }

        previousEgg = egg;

        egg.moveToBottom();

        if(i === 1) {
          focusedEgg = egg;
        }

        delete(egg);
    }

precursorImg.src = urlBase + imageSources.precursor;

ui.updateIcons(1);
//ui.focus(focusedEgg);

stage.add(staticLayer, layer, focusLayer, tempLayer);

//staticLayer.draw();
//layer.draw();

var currentDragObject;
stage.on("dragstart", function(e){
    e.target.moveTo(tempLayer);
    currentDragObject = e.target;
  //  text.text('Moving ' + e.target.name());

    staticLayer.draw();
    focusLayer.draw();
    //
});

var previousShape;
stage.on("dragmove", function(evt){
    var pos = stage.getPointerPosition();
    var shape = focusLayer.getIntersection(pos);
    tempLayer.moveToTop();
    if (previousShape && shape) {
        if (previousShape !== shape) {
            // leave from old targer
            previousShape.fire('dragleave', {
                type : 'dragleave',
                target : previousShape,
                evt : evt.evt
            }, true);

            // enter new targer
            shape.fire('dragenter', {
                type : 'dragenter',
                target : shape,
                evt : evt.evt
            }, true);
            previousShape = shape;
        } else {
            previousShape.fire('dragover', {
                type : 'dragover',
                target : previousShape,
                evt : evt.evt
            }, true);
        }
    } else if (!previousShape && shape) {
        previousShape = shape;
        shape.fire('dragenter', {
            type : 'dragenter',
            target : shape,
            evt : evt.evt
        }, true);
    } else if (previousShape && !shape) {
        previousShape.fire('dragleave', {
            type : 'dragleave',
            target : previousShape,
            evt : evt.evt
        }, true);
     previousShape = undefined;
    }
});
stage.on("dragend", function(e){
    var pos = stage.getPointerPosition();
    var shape = focusLayer.getIntersection(pos);

    if(shape) {
      if(shape.opacity() === 1.0) {
        if(shape instanceof Konva.Circle || (shape && shape.inEgg && shape.name() !== 'container')) {

              previousShape.fire('drop', {
                  type : 'drop',
                  target : previousShape,
                  evt : e.evt
              }, true);

          previousShape = undefined;
          e.target.moveTo(layer);
          staticLayer.draw();
          focusLayer.draw();
          tempLayer.draw();
          return;
      }
  }
}

  ui.returnToContainer(e.target, iconHomeScale);
});

stage.on("dragenter", function(e){
    if(e.target.opacity < interactableThresholdOpacity) return false;

    if(e.target instanceof Konva.Circle) {
    //  e.target.fill(circleHoverColor);
  //    text.text('dragenter ' + e.target.name());
    //  layer.draw();
  }
});

stage.on("dragleave", function(e){
  if(e.target.opacity < interactableThresholdOpacity) return false;

  if(e.target instanceof Konva.Circle) {
    e.target.fill(circleFillColor);
//    text.text('dragleave ' + e.target.name());
    //layer.draw();
  }
});

stage.on("dragover", function(e){
  if(e.target.opacity() < interactableThresholdOpacity) return false;
  console.log("Over "+e.target.name());

  if(e.target instanceof Konva.Circle) {
        e.target.fill(circleHoverColor);
      //  text.text('dragover ' + e.target.name());

        focusLayer.draw();
  }
});

stage.on("drop", function(e){

  if(e.target.opacity() !== 1.0) {
      ui.returnToContainer(currentDragObject, iconHomeScale);
      return;
  }

  if(e.target instanceof Konva.Circle) {
        e.target.fill(circleDropColor);
      //  text.text('drop ' + e.target.name()+" x: "+e.target.x()+" y: "+e.target.y());
        //layer.draw();

        if(! ui.placeInEgg(e.target)) {
            ui.returnToContainer(currentDragObject, iconHomeScale);
        }
  }
});

stage.on("touchstart mouseover", function(e){
  //  console.log("fired mo ");
      if(e.target.opacity() < interactableThresholdOpacity) {
          return false;
      }
      var pos = stage.getPointerPosition();
      var shape = staticLayer.getIntersection(pos);

      if(shape && typeof shape.getUIComponentType === 'function') {
          if(shape.getUIComponentType() === 'button') {
              if(e.type === "touchstart") {
                    shape.fill(buttonClickColor);
              } else {
                    shape.fill(buttonHoverColor);
              }

              staticLayer.draw();
          }
      }
});

stage.on("mouseout", function(e){
      if(e.target.opacity() < interactableThresholdOpacity) {
          return false;
      }
      var shape = e.target;

      if(shape && typeof shape.getUIComponentType === 'function') {
          if(shape.getUIComponentType() === 'button') {
            console.log("out");
              shape.fill(buttonFillColor);
              staticLayer.draw();
          }
      }
});
stage.on("mousedown", function(e){
  if(e.target.opacity() < interactableThresholdOpacity) {
      return false;
  }

  console.log(e);

      var shape = e.target;

      if(shape && typeof shape.getUIComponentType === 'function') {
          if(shape.getUIComponentType() === 'button') {
              shape.fill(buttonClickColor);
          }
      }
});
stage.on("touchend mouseup", function(e){
      if(e.target.opacity() < interactableThresholdOpacity) {
          return false;
      }

      var shape = e.target;
      if(shape && typeof shape.getUIComponentType === 'function') {
          if(shape.getUIComponentType() === 'button') {
              var name = shape.name();
              switch(name) {
                    case 'undo':
                        ui.undo();
                    break;
                    case 'reset':
                        console.log('reset');
              }

              shape.fill(buttonFillColor);
              staticLayer.draw();
          }
      }
});
}};



document.addEventListener('DOMContentLoaded', function() {
    app.run();

});
