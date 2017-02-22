var $ = require('jquery-slim');
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

var circleFocusMultiplier = 2.3;

var buttonLabelColor = 'rgb(117,128,194)';
var buttonFillColor = circleFillColor;
var buttonHoverColor = circleDropColor;
var buttonClickColor = 'orange';

var interactableThresholdOpacity = 0.8;

var topOffset = -35;
var problemPosFormula = 'stage.width() - (circleDiameter * 5)';
var cctXPos = 'iconWidth / 4';
var cctYPos = 'iconWidth * 1.2';

var iconWidth = 140;
var iconHeight = 140;
var iconHomeScale = 0.8;
var iconHSpacing = 'iconWidth * 0.6';
var iconVSpacing = 'iconHeight * 0.8';
var iconsPerRow = 3;

var containerFill = circleHoverColor;//'rgb(201,200,184)';
var containerStroke = 'black';
var containerHeight = 400;
var containerWidth = (iconWidth * iconsPerRow) * (iconHomeScale - 0.17);//- (iconWidth * 0.25);

var rightLabelOffset = - (circleSpace / 2);
var leftLabelOffset = -(circleSpace);
var scrollDistance = 5;
var urlBase = '';//'/test/meiosis/'

var focusedEgg = null;
var focusPositionX = 460;
var focusPositionY = 255;

var textEggLabels = [ {x: -67, y: (circleSpace / 2), text: 'Precursor Germ cells'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Prophase I'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Metaphase I'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Anaphase I'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Telophase I'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Cytokinesis'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Cytokinesis'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Prophase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Prophase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Metaphase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Metaphase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Anaphase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Anaphase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Telophase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Telophase II'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Cytokinesis'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Cytokinesis'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Cytokinesis'},
                      {x: circleSpace + rightLabelOffset, y: 0, text: 'Cytokinesis'},
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

var DOMLabelWidth = 0; // set with jquery
var DOMLabelHeight = 0;

var debug = false;

var ui = {

setEggLabel: function(i, egg, x, y) {
  if(! textEggLabels[i]) return false;

  var text = new Konva.Text({
      fill : 'black',
      x: x + textEggLabels[i].x,
      y: y + textEggLabels[i].y,
      fontSize: '14'
  });

  text.startingPosition = {x: x + textEggLabels[i].x, y: y + textEggLabels[i].y};
  text.text(textEggLabels[i].text);

  egg.group.add(text);
  egg.label = text;

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

                var str = egg.label.text();
                var dipi = str.indexOf("\n(Diploid)");
                var hapi = str.indexOf("\n(Haploid)");

                var pos = dipi || hapi;

                if(pos > 0) {
                  str = str.substr(0, pos);
                  egg.label.setText(str);
                }

                if(egg.prev && !egg.prev.isPrecursor) {
                    egg.prev.opacity(1.0);
                    ui.toggleAllIconsDraggable(egg.prev, true);
                }
                if(egg.next) {
                    egg.next.opacity(0.4);
                    ui.toggleAllIconsDraggable(egg.next, false);
                }

                layer.batchDraw();

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

getIcons: function(node) {
    var node = node || layer;
    var icons = node.children.filter(ui.isIcon);
    return icons;
},

getOrphanedIcons: function(node) {
    var node = node || layer;
    var icons = node.children.filter(ui.isIcon);
  //  console.log(icons);
    var pi = icons.filter(ui.unPlacedIcon);
    return pi;
},

allIconsPlaced: function() {
    return ui.getOrphanedIcons().length === 0;
},

clearIcons: function(node) {
    var node = node || layer;
    var icons = node.children.filter(ui.isIcon);

    icons.forEach(function(icon) {
        icon.destroy();
    });
},

clearIconMenu: function(node) {
    var node = node || staticLayer;

    var icons = node.children.filter(ui.isIcon);
  //  var orphanedIcons = {values: icons.filter(ui.unPlacedIcon)};

    ui.getOrphanedIcons(node).forEach(function(icon) {
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

placeInEgg: function(egg, pointerPos, sizeChangeOnDrop) {


    sizeChangeOnDrop = sizeChangeOnDrop || 1;

    var w = app.currentDragObject.getWidth();
    var h = app.currentDragObject.getHeight();

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

    app.currentDragObject.setWidth(w);
    app.currentDragObject.setHeight(h);

    var prevEgg = egg.prev;

    if(prevEgg) {
        if(prevEgg.chromos.length > 0 || prevEgg.isPrecursor) {
              if(egg.next && egg.next === app.currentDragObject.inEgg) {
                    return false;
              }

              if(! prevEgg.isPrecursor) {
                  prevEgg.opacity(0.4);

                  ui.toggleAllIconsDraggable(prevEgg, false);
              }

              if(ui.allIconsPlaced()) {
                  ui.toggleAllIconsDraggable(egg, true);
              }

              egg.chromos.push(app.currentDragObject);
              app.currentDragObject.inEgg = egg;

              if(! egg.isPrecursor) undoHistory.push(egg);

              app.currentDragObject.setPlaced(true);

        }
      }

    if(egg.next) {

        $(egg).trigger('beforeEggTween', { callback: function() {
          focusLayer.hide();
          ui.updateIcons(egg.next.sequence);
          egg.moveToBottom();
          ui.focus(egg, {focusOut: true,
                            onComplete: function() {
                                  focusLayer.show();
                              ui.focus(egg.next,
                                {focusOut: false,
                                onComplete: function() {

                                }});
                              egg.next.moveToTop();
                            }});
        }
      });
    }
  //  app.currentDragObject.setX(pointerPos.x + (app.currentDragObject.getWidth/2));
  //  app.currentDragObject.setY(pointerPos.y + (app.currentDragObject.getHeight/2));

    return true;
},

scrollPage: function(egg) {
  //    ui.moveIcons(layer, tempLayer);

  //    tempLayer.draw();
  //  layer.draw();
      var layerCentre = (layer.y() / 2);
      var y =  layerCentre < egg.group.y() ? -egg.group.y() / 20 : egg.group.y() / 20;

        app.tween = new Konva.Tween({
          node: layer,
          duration: 0.5,
          y: y,
          opacity: 1,
          onFinish: function() {
              //ui.moveIcons(tempLayer, layer);

              layer.draw();
              tempLayer.draw();
              staticLayer.draw();
          }
      });

      if(app.timeout)
        clearTimeout(app.timeout);
      // start tween after 2 seconds
      app.timeout = setTimeout(function() {
          app.tween.play();
      }, 10);

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
  scaled = 1.0;

  if(icon.getWidth() !== iconWidth) {
      icon.setWidth(iconWidth * scaled);
  }

  if(icon.getHeight() !== iconHeight) {
      icon.setHeight(iconHeight * scaled);
  }

  icon.moveTo(iconMenu.group);
  icon.moveToTop();

  //var index = Number(icon.name().split('_')[1]);

  icon.setX(icon.getHomePos().x);
  icon.setY(icon.getHomePos().y);

  layer.draw();
  tempLayer.draw();
  staticLayer.draw();

  if(icon.inEgg) {
    icon.inEgg.chromos.remove(app.currentDragObject);
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

ui.clearIconMenu(iconMenu.group);

if(ui.icon.konvaWrappers[seqStr].length === 0) {

  var xchromPos = 0;
  var ychromPos = 0;
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
        iconMenu.group.add(ui.icon.konvaWrappers[seqStr][inx]);
      //  iconMenu.uiContainer.moveTopBottom();
        ui.icon.konvaWrappers[seqStr][inx].moveToTop();
        iconMenu.group.draw();
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

if(focusedEgg.group.startingPosition && sequence == 1) {
    ui.focus(focusedEgg);
}
},
focusing: false,
focus: function(thisEgg, params) {
  if(!thisEgg.group.startingPosition) return false;
  if(ui.focusing) return false;

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

  x = params.focusOut ? thisEgg.group.startingPosition.x : focusPositionX;
  y = params.focusOut ? thisEgg.group.startingPosition.y : focusPositionY;

  if(params.focusOut) {
      thisEgg.group.moveTo(layer);
  } else {
      thisEgg.group.moveTo(focusLayer);
  }

  //if(app.currentDragObject)
  //console.log("Current parent before focus tween "+app.currentDragObject.parent.attrs.name);

  focusLayer.moveToTop();
  thisEgg.group.opacity(1);
  thisEgg.group.moveToTop();

  ui.scrollPage(params.reverseScroll ? thisEgg.prev : thisEgg.next);

  app.safeLabel = null;

  if(thisEgg.label) {
      app.safeLabel = thisEgg.label
  } else if(thisEgg.next.label) {
      app.safeLabel = thisEgg.next.label;
      app.safeLabel.moveTo(thisEgg.next.group);
  }

  app.eggTween = new Konva.Tween({
      node: thisEgg,
      duration: 0.2,
      fill:  params.focusOut ? circleFillColor : '#FFF',
      opacity: params.focusOut ? 0.2 : 1,
      onFinish: function() {
          if(app.safeLabel) {
              app.safeLabel.moveTo(thisEgg.group);
          }
            iconMenu.setListening(true);
            resetButton.setListening(true);
            undoButton.setListening(true);
          //  app.tweenIsPlaying = false;

          delete(app.eggTween);
          delete(app.safeLabel);
          delete(app.groupTween);
      }
  });

  app.playEggTween = function() {
        if(app.eggTween) {

          app.eggTween.play();

        }

        ui.focusing = false;

  }
/*  app.iconTweens = {};
  thisEgg.group.children.forEach(function(node) {
    //  if(typeof node === Konva.Image) {
          app.iconTweens[node.name()] = new Konva.Tween({
              node: node,
              duration: 0.5,
              rotation: 360
          });

          setTimeout(function() {
              app.iconTweens[node.name()].play();

              clearTimeout();
          }, 1000);
  //    }
});*/
  if(app.safeLabel) {
  app.textTween = new Konva.Tween({
      node: app.safeLabel,
      duration: 0.1,
      x: params.focusOut ? app.safeLabel.startingPosition.x : -34, //text.x() - 100,
      y: params.focusOut ? app.safeLabel.startingPosition.y : 50,
      onFinish: function() {
          app.playEggTween();
      }
  });
    }

  app.groupTween = app.groupTween || new Array();

  if(typeof app.groupTween.destroy === 'function') {
      app.groupTween.destroy();
  }

  app.groupTween = new Konva.Tween({
    node: thisEgg.group,
    duration: 0.6,
    x: x,
    y: y,
    easing: Konva.Easings.BackEaseIn,
    opacity: params.focusOut ? 0.2 : 1,
    scaleX: params.focusOut ? 1 : circleFocusMultiplier,
    scaleY: params.focusOut ? 1 : circleFocusMultiplier,
    onFinish: function() {
        thisEgg.cache();

        app.textTween.play();
        if(params.onComplete) {
              params.onComplete();
        }

      //  app.tweenIsPlaying = false;
        ui.focusing = true;
    }
  });

    app.thread = setTimeout(function() {
        iconMenu.setListening(false);
        resetButton.setListening(false);
        undoButton.setListening(false);
      //  app.tweenIsPlaying = true;
        app.groupTween.play();

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

Konva.Rect.prototype.group = null;
Konva.Rect.prototype.uiContainer = function(params) {
      this.group = new Konva.Group({
        x: params.x,
        y: params.y
      });

      this.group.add(this);
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

Konva.Group.prototype.startingPosition = null;

// egg settings
Konva.Circle.prototype.initEgg = function(params) {
        this.chromos = params.chromos;
        this.next = params.next;
        this.prev = params.prev;
        var egg = this;

        this.group = new Konva.Group({
              x: params.x,
              y: params.y,
              name: egg.name() + '_group'
        });

        this.group.startingPosition = {x: params.x, y: params.y}
        if(this.isPrecursor) {
          staticLayer.add(this.group);
        } else {
          layer.add(this.group);
        }
        this.group.add(egg);

        $(this).on("beforeEggTween", function(e, o){
            $(stage).trigger('touchEgg', { egg: e.target, callback: o.callback });
        });

        return this.group;
};

/*Konva.Circle.prototype.emptyChromos = function() {
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
};*/

Konva.Circle.prototype.isPrecursor = false;
Konva.Circle.prototype.scrollPageOnDrop = null;
Konva.Circle.prototype.group = null;
Konva.Circle.prototype.label = null;

Konva.Text.prototype.startingPosition = null;
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

//layer.add(text);

// setup chromosome container
var iconMenu = new Konva.Rect({
  x: 0,//eval(cctXPos),
  y: 0,//eval(cctYPos),
      width: containerWidth,
      height: containerHeight,
      fill: containerFill,
      stroke: containerStroke,
      strokeWidth: 1,
      name: 'iconMenu',
});

iconMenu.uiContainer({
      x: eval(cctXPos),
      y: eval(cctYPos)
});

var undoButton = new Konva.Rect({
  x: containerWidth / 6,
  y: containerHeight - iconHeight / 2,
  width: iconWidth / 2,
  height: iconHeight / 3,
  fill: containerFill,
  stroke: containerStroke,
  strokeWidth: 2,
  name: 'undo',
  type: 'icon'
});

var undoText = new Konva.Text({
  x: containerWidth / 6 + iconWidth * 0.1,
  y: containerHeight - (iconHeight / 2) + 15,
    fill : 'black',
    text: 'Undo',
    fontSize: 18,
     fontFamily: 'Calibri',
     fill: buttonLabelColor
});

var resetButton = new Konva.Rect({
  x: containerWidth / 6 + iconWidth * 0.6,
  y: containerHeight - iconHeight / 2,
  width: iconWidth / 2,
  height: iconHeight / 3,
  fill: containerFill,
  stroke: containerStroke,
  strokeWidth: 2,
  name: 'reset',
  opacity: 1,
});

resetButton.setUIComponentType('button');
undoButton.setUIComponentType('button');

var resetText = new Konva.Text({
    x: containerWidth / 6 + iconWidth * 0.7,
    y: containerHeight - (iconHeight / 2) + 15,
    fill : 'black',
    text: 'Reset',
    fontSize: 18,
     fontFamily: 'Calibri',
     fill: buttonLabelColor,
     opacity: 1
});

iconMenu.group.add(undoButton);
iconMenu.group.add(undoText);

undoText.cache();
resetText.cache();

undoText.setListening(false);

iconMenu.group.add(resetButton);
iconMenu.group.add(resetText);

resetText.setListening(false);

staticLayer.add(iconMenu.group);
iconMenu.setListening(false);

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
                          width: iconWidth / 1.7,
                          height: iconHeight / 1.7,
                          name: 'precursor_'+i,
                          fill: 'transparent'
                    });

                    precursor.setUIComponentType('stillImage');
                    staticLayer.add(precursor);
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

        opacity = i > 1 ? 0.4 : 1.0;

        var egg = new Konva.Circle({
            radius: (circleDiameter / 2) * circleFocusMultiplier,
            stroke: circleStrokeColor,
            scaleX: 1 / circleFocusMultiplier,
            scaleY: 1 / circleFocusMultiplier,
            name : 'egg_' + i,
            opacity: opacity,
            fill: circleDropColor,
        });

        egg.isPrecursor = i < 1;
        egg.sequence = i == 5 || i == 6 ? 5 : i;
        egg.scrollPageOnDrop = 'down';

        egg.initEgg({next: null, prev:  previousEgg, chromos: [], x: x, y: y});
        ui.setEggLabel(i, egg, 0, 0);

        if(previousEgg && egg) {
          previousEgg.next = egg;
        }

        previousEgg = egg;

        egg.group.moveToBottom();

        egg.cache();

        if(i === 1) {
          focusedEgg = egg;
        }

        delete(egg);
    }

precursorImg.src = urlBase + imageSources.precursor;

ui.updateIcons(1);
//ui.focus(focusedEgg);

stage.add(staticLayer, layer, focusLayer, tempLayer);


layer.setListening(false);
layer.children.forEach(
  function(n) {
      n.opacity(0.2);
});

app.currentDragObject = null;
stage.on("dragstart", function(e){
    e.target.moveTo(tempLayer);
    app.currentDragObject = e.target;

    tempLayer.batchDraw();
    staticLayer.batchDraw();
    focusLayer.batchDraw();
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

          e.target.moveTo(shape.group);
          e.target.x(0-circleDiameter/2);//- 1 / (pos.x / shape.group.x));
          e.target.y(0-circleDiameter/2);//- 1 / (pos.y / dr.y));

          e.target.moveToTop();

          return;
      }
  }
}

  ui.returnToContainer(e.target, iconHomeScale);
});

stage.on("dragenter", function(e){
    if(e.target.opacity < interactableThresholdOpacity) return false;

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
  var pointerPos = stage.getPointerPosition();
  if(e.target.opacity() !== 1.0) {
      ui.returnToContainer(app.currentDragObject, iconHomeScale);
      return;
  }

  if(e.target instanceof Konva.Circle) {
        if(! ui.placeInEgg(e.target, pointerPos)) {
            ui.returnToContainer(app.currentDragObject, iconHomeScale);
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
                        window.location.reload();
              }

              shape.fill(buttonFillColor);
              staticLayer.draw();
          }
      }
});

// jquery events
$(stage).on('touchEgg', function(e, args){
		$("#labelme").css({left: args.egg.group.x(), top: args.egg.group.y()}).show();

    $("#labelme input").on('change', function(e) {
        if(!args.egg.label) {
            args.egg.label = $(args.egg.label).clone(args.egg.next.label);
            app.safeLabel = args.egg.label;
        }

        var str = args.egg.label.text();
        var type = $(e.target).closest('label').text();
        args.egg.label.text(str + "\n("+type+")");
        args.callback();
        $("#labelme").hide().find('input').prop('checked', false).off('change');
    });
});



DOMLabelWidth = $('#labelme').width();
DOMLabelHeight = $('#labelme').height();
}};



document.addEventListener('DOMContentLoaded', function() {
    app.run();

});
