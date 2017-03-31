require('konva');
require('bootstrap');

var DEBUG = false;

var app = { run: function(){

app.sizeChangeOnDrop = 3.2;

var width = 800;
var height = 610;
var circleDiameter = 90;
var circleSpace = 100;

var borderColor = '#896724';
var circleFillColor = 'rgb(201,200,184)';//'rgba(254,255,173,0.8)';
var circleDropColor = '#FFF';//'#DAD7C5';
var circleHoverColor = '#EEE';//'rgb(117,128,194)';
var circleStrokeColor = 'black';

var circleFocusMultiplier = 4.0;

var buttonLabelColor = '#F7DFAE';
var buttonFillColor = '#467D7D';
var buttonHoverColor = '#699494';
var buttonClickColor = '#FFD874';

var interactableThresholdOpacity = 0.8;

var topOffset = -35;

var iconWidth = 140;
var iconHeight = 140;
var iconHomeScale = 0.8;
var iconsPerRow = 3;

var containerFill = '#FFF1D6';//'rgb(201,200,184)';
var containerStroke = 'black';
var containerHeight = 160;
var containerX = 0;
var containerY = 280;
var containerWidth = 530;

var precursorX = 28;
var precursorY = 10;

//- (iconWidth * 0.25);
var rightLabelOffset = - (circleSpace / 2);
var leftLabelOffset = - (circleSpace);
var scrollDistance = 10;
var urlBase = '';//'/test/meiosis/'

var focusedEgg = null;
var focusPositionX = 410;
var focusPositionY = 185;

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
                    ];

var imageSources = {
                    precursor: 'img/Precursor-Germ-Cell.png',
                    sequences: {
                      PROPHASE_I:  {
                        icons: [  'img/Prophase-1.png',
                                  'img/X-Prophase-1A.png',
                                  'img/X-Prophase-1B.png'],
                        answerIds: [ 'c' , 'x1' , 'x2']
                      },
                       METAPHASE_I:  {
                          // links to previous answers
                          links: {
                            c: ['c'],
                            x1: ['x1','x2'],
                            x2: ['x1','x3']
                          },
                          icons: [ 'img/Metaphase-1.png',
                                    'img/X-Metaphase-1A.png',
                                    'img/X-Metaphase-1B.png',
                                    'img/X-Metaphase-1C.png',
                                  ],
                          answerIds: ['x2', 'x1', 'c', 'x3'],
                      },
                       ANAPHASE_I:  {
                         links: {
                           c: ['c','x1'],
                           x1: ['x2'],
                           x2: ['x3','x1'],
                           x3: ['x2','x1','x3'],
                         },
                          icons: [ 'img/Anaphase-1.png',
                          'img/X-Metaphase-1A.png',
                          'img/X-Metaphase-1B.png',
                          'img/X-Metaphase-1C.png',],
                        answerIds: ['x3', 'x1', 'x2', 'c'],
                     },
                     TELOPHASE_I:  {
                         links: {
                           c: ['c'],
                           x1: ['x1','x2'],
                           x2: ['x1','x3'],
                          x3: ['x2','x1','x3'],
                         },
                          icons: [ 'img/Telophase-1.png',
                          'img/X-Metaphase-1A.png',
                          'img/X-Metaphase-1B.png',
                          'img/X-Metaphase-1C.png',],
                          answerIds: ['x2', 'x1', 'c', 'x3'],
                     },
                     CYTOKINESIS_A:  {
                       links: {
                         c: ['c'],
                         x1: ['x1','x2'],
                         x2: ['x1','x3'],
                            x3: ['x2','x1','x3'],
                       },
                      icons: [ 'img/A. Cytokinesis.png',
                                  'img/B. Cytokinesis.png',
                                  'img/X-Metaphase-1A.png',
                                  'img/X-Metaphase-1B.png',
                                  'img/X-Metaphase-1C.png',],
                      answerIds: ['x2', 'x1', 'c', 'x3', 'x4'],
                     },
                     CYTOKINESIS_B:  {
                       links: {
                         c: ['c'],
                         x1: ['x1','x2'],
                         x2: ['x1','x3'],
                            x3: ['x2','x1','x3'],
                            x4: ['x2','x3','x1', 'c']
                       },
                        icons: [ 'img/A. Cytokinesis.png',
                                'img/B. Cytokinesis.png',
                                'img/X-Metaphase-1A.png',
                                'img/X-Metaphase-1B.png',
                                'img/X-Metaphase-1C.png',],
                        answerIds: ['x3', 'x1', 'x2', 'c'],
                    },
                    PROPHASE_II_A:  {
                      links: {
                        c: ['c'],
                        x1: ['x1','x2'],
                        x2: ['x1','x3'],
                           x3: ['x2','x1','x3'],
                      },
                       icons: [ 'img/A. Cytokinesis.png',
                               'img/B. Cytokinesis.png',
                               'img/X-Metaphase-1A.png',
                               'img/X-Metaphase-1B.png',
                               'img/X-Metaphase-1C.png'],
                       answerIds: ['c', 'x1', 'x2', 'x3'],
                   },
                   PROPHASE_II_B:  {
                     links: {
                       c: ['c'],
                       x1: ['x1','x2'],
                       x2: ['x1','x3'],
                          x3: ['x2','x1','x3'],
                     },
                      icons: [ 'img/A. Cytokinesis.png',
                              'img/B. Cytokinesis.png',
                              'img/X-Metaphase-1A.png',
                              'img/X-Metaphase-1B.png',
                              'img/X-Metaphase-1C.png'],
                      answerIds: ['c', 'x1', 'x2', 'x3'],
                  },
                   METAPHASE_II_A:  {
                     links: {
                       c: ['c'],
                       x1: ['x1','x2'],
                       x2: ['x1','x3'],
                          x3: ['x2','x1','x3'],
                     },
                      icons: [ 'img/A. Cytokinesis.png',
                              'img/B. Cytokinesis.png',
                              'img/X-Metaphase-1A.png',
                              'img/X-Metaphase-1B.png',
                              'img/X-Metaphase-1C.png',],
                      answerIds: ['c', 'x1', 'x2', 'x3'],
                  },
                  METAPHASE_II_B:  {
                    links: {
                      c: ['c'],
                      x1: ['x1','x2'],
                      x2: ['x1','x3'],
                         x3: ['x2','x1','x3'],
                    },
                     icons: [ 'img/A. Cytokinesis.png',
                             'img/B. Cytokinesis.png',
                             'img/X-Metaphase-1A.png',
                             'img/X-Metaphase-1B.png',
                             'img/X-Metaphase-1C.png',],
                     answerIds: ['c', 'x1', 'x2', 'x3'],
                 },
                  ANAPHASE_II_A:  {
                    links: {
                      c: ['c'],
                      x1: ['x1','x2'],
                      x2: ['x1','x3'],
                         x3: ['x2','x1','x3'],
                    },
                     icons: [ 'img/A. Cytokinesis.png',
                             'img/B. Cytokinesis.png',
                             'img/X-Metaphase-1A.png',
                             'img/X-Metaphase-1B.png',
                             'img/X-Metaphase-1C.png',],
                     answerIds: ['c', 'x1', 'x2', 'x3'],
                 },
                 ANAPHASE_II_B:  {
                   links: {
                     c: ['c'],
                     x1: ['x1','x2'],
                     x2: ['x1','x3'],
                        x3: ['x2','x1','x3'],
                   },
                    icons: [ 'img/A. Cytokinesis.png',
                            'img/B. Cytokinesis.png',
                            'img/X-Metaphase-1A.png',
                            'img/X-Metaphase-1B.png',
                            'img/X-Metaphase-1C.png',],
                    answerIds: ['c', 'x1', 'x2', 'x3'],
                },
                 TELOPHASE_II_A:  {
                   links: {
                     c: ['c'],
                     x1: ['x1','x2'],
                     x2: ['x1','x3'],
                        x3: ['x2','x1','x3'],
                   },
                    icons: [ 'img/A. Cytokinesis.png',
                            'img/B. Cytokinesis.png',
                            'img/X-Metaphase-1A.png',
                            'img/X-Metaphase-1B.png',
                            'img/X-Metaphase-1C.png',],
                    answerIds: ['c', 'x1', 'x2', 'x3'],
                },
                TELOPHASE_II_B:  {
                  links: {
                    c: ['c'],
                    x1: ['x1','x2'],
                    x2: ['x1','x3'],
                       x3: ['x2','x1','x3'],
                  },
                   icons: [ 'img/A. Cytokinesis.png',
                           'img/B. Cytokinesis.png',
                           'img/X-Metaphase-1A.png',
                           'img/X-Metaphase-1B.png',
                           'img/X-Metaphase-1C.png',],
                   answerIds: ['c', 'x1', 'x2', 'x3'],
               },
                CYTOKINESIS_C:  {
                  links: {
                    c: ['c'],
                    x1: ['x1','x2'],
                    x2: ['x1','x3'],
                       x3: ['x2','x1','x3'],
                  },
                   icons: [ 'img/A. Cytokinesis.png',
                           'img/B. Cytokinesis.png',
                           'img/X-Metaphase-1A.png',
                           'img/X-Metaphase-1B.png',
                           'img/X-Metaphase-1C.png',],
                   answerIds: ['c', 'x1', 'x2', 'x3','x4','x5'],
               },
               CYTOKINESIS_D:  {
                 links: {
                   c: ['c'],
                   x1: ['x1','x2'],
                   x2: ['x1','x3'],
                      x3: ['x2','x1','x3'],
                 },
                  icons: [ 'img/A. Cytokinesis.png',
                          'img/B. Cytokinesis.png',
                          'img/X-Metaphase-1A.png',
                          'img/X-Metaphase-1B.png',
                          'img/X-Metaphase-1C.png',
                          'img/X-Metaphase-1C.png'],
                  answerIds: ['c', 'x1', 'x2', 'x3','x4','x5'],
              },
              CYTOKINESIS_E:  {
                links: {
                  c: ['c'],
                  x1: ['x1','x2'],
                  x2: ['x1','x3'],
                     x3: ['x2','x1','x3'],
                     x4: ['c','x4'],
                     x5: ['x2','x3']
                },
                 icons: [ 'img/A. Cytokinesis.png',
                         'img/B. Cytokinesis.png',
                         'img/X-Metaphase-1A.png',
                         'img/X-Metaphase-1B.png',
                         'img/X-Metaphase-1C.png',
                       'img/X-Metaphase-1C.png'],
                answerIds: ['c', 'x1', 'x2', 'x3','x4','x5'],
             },
             CYTOKINESIS_F:  {
                     links: {
                       c: ['c'],
                       x1: ['x1','x2'],
                       x2: ['x1','x3'],
                      x3: ['x2','x1','x3'],
                      x4: ['c','x4'],
                      x5: ['x2','x3']
                     },
                     icons: [ 'img/A. Cytokinesis.png',
                             'img/B. Cytokinesis.png',
                             'img/X-Metaphase-1A.png',
                             'img/X-Metaphase-1B.png',
                             'img/X-Metaphase-1C.png',
                           'img/X-Metaphase-1C.png'],
                     answerIds: ['c', 'x1', 'x2', 'x3','x4','x5'],
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
               'PROPHASE_II_A',
               'PROPHASE_II_B',
               'METAPHASE_II_A',
               'METAPHASE_II_B',
               'ANAPHASE_II_A',
               'ANAPHASE_II_B',
               'TELOPHASE_II_A',
               'TELOPHASE_II_B',
               'CYTOKINESIS_C',
               'CYTOKINESIS_D',
               'CYTOKINESIS_E',
               'CYTOKINESIS_F',
             ];

var loadCount = [];

 app.stage = new Konva.Stage({
    container: '#container',
    width: width,
    height: height
});

var stageCenter = app.stage.width() / 2;

app.layer = new Konva.Layer({name: 'eggLayer'});

app.tempLayer = new Konva.Layer({name: 'dragLayer'});

app.staticLayer = new Konva.Layer({name: 'staticLayer'});

app.focusLayer = new Konva.Layer({name: 'focusLayer'});

var undoHistory = [];

var DOMLabelWidth = 0; // set with jquery
var DOMLabelHeight = 0;

// evaluate dimensions
var problemPosFormula = app.stage.width() - (circleDiameter * 5);
var cctXPos = containerX;
var cctYPos = containerY;
var iconHSpacing = iconWidth * 0.6;
var iconVSpacing = iconHeight * 0.8;
//var containerWidth = (iconWidth * iconsPerRow) * (iconHomeScale - 0.17);

app.ui = {

setEggLabel: function(i, egg, x, y) {
  if(! textEggLabels[i]) return false;

  var text = new Konva.Text({
      fill : '#1F325C',
      x: x + textEggLabels[i].x,
      y: y + textEggLabels[i].y,
      fontSize: '14'
  });

  text.startingPosition = {x: x + textEggLabels[i].x, y: y + textEggLabels[i].y};
  text.text(textEggLabels[i].text);

  egg.group.add(text);
  egg.label = text;

  app.ui.debugRect(x + textEggLabels[i].x, y + textEggLabels[i].y, text.getWidth(), text.getHeight());
},

undo: function() {
    var egg = undoHistory[undoHistory.length-1];

    if(egg) {
        app.ui.clearIconMenu();

        if(egg.chromos.length > 0) {
          var ret = egg.chromos.pop();
          app.ui.returnToContainer(ret, iconHomeScale);
        }

        if(egg.chromos.length === 0) {
                undoHistory.pop();

                app.ui.resetMenuOptions(egg);

                egg.fill(circleFillColor);
                egg.opacity(1.0);

                var str = egg.label.text();

                var dipi = str.indexOf("\n(hap)");
                var hapi = str.indexOf("\n(dip)");

                var pos = dipi > 0 ? dipi : hapi;

                if(pos > 0) {
                  str = str.substr(0, pos);
                  egg.label.setText(str);
                }

                if(egg.prev && !egg.prev.isPrecursor) {
                    egg.prev.opacity(1.0);
                    egg.prev.canswerId = null;
                    app.ui.toggleAllIconsDraggable(egg.prev, true);
                }
                if(egg.next) {
                    egg.next.opacity(0.4);
                    egg.next.canswerId = null;
                    app.ui.toggleAllIconsDraggable(egg.next, false);
                }

                app.layer.batchDraw();

                app.ui.focus(egg.next, { focusOut: true,
                                onComplete: function() {
                                      app.ui.focus(egg, {
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
    if(DEBUG) {

        var rect = new Konva.Rect({
            stroke: borderColor,
            x: x - 5,
            y: y - 5,
            width: w + 10,
            height: h + 10
        });

        app.layer.add(rect);
   }

  return false;
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
    node = node || app.layer;
    var icons = node.children.filter(app.ui.isIcon);
    return icons;
},

getOrphanedIcons: function(node) {
    node = node || app.layer;
    var icons = node.children.filter(app.ui.isIcon);
  //  console.log(icons);
    var pi = icons.filter(app.ui.unPlacedIcon);
    return pi;
},

allIconsPlaced: function() {
    return app.ui.getOrphanedIcons().length === 0;
},

clearIcons: function(node) {
    node = node || app.layer;
    var icons = node.children.filter(app.ui.isIcon);

    icons.forEach(function(icon) {
        icon.destroy();
    });
},

clearIconMenu: function(node) {
    node = node || app.staticLayer;

    var icons = node.children.filter(app.ui.isIcon);
  //  var orphanedIcons = {values: icons.filter(app.ui.unPlacedIcon)};

    app.ui.getOrphanedIcons(node).forEach(function(icon) {
        icon.hide();
    });

    //staticLayer.draw();
},

moveIcons: function(layer1, layer2) {

    app.ui.getOrphanedIcons(layer1).forEach(function(icon)
      {
        if(DEBUG) {
          console.log('moving icon '+icon.name()+' from '+layer1.name()+'  to '+layer2.name());
        }
          icon.moveTo(layer2);
          icon.moveToTop();
      });
},

toggleAllIconsDraggable: function(egg, draggable) {
  if(!egg || !egg.chromos) return false;

  if(typeof draggable !== 'boolean') {
      draggable = true;
  }

  egg.chromos.forEach(function(chrom) {
      chrom.draggable(draggable);
  });
},

placeInEgg: function(egg, pointerPos) {
    var w = app.currentDragObject.getWidth();
    var h = app.currentDragObject.getHeight();

    egg.canswerId = app.currentDragObject.answerId;

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

                  app.ui.toggleAllIconsDraggable(prevEgg, false);
              }

              if(app.ui.allIconsPlaced()) {
                  app.ui.toggleAllIconsDraggable(egg, true);
              }

              egg.chromos.push(app.currentDragObject);
              app.currentDragObject.inEgg = egg;

              if(! egg.isPrecursor) undoHistory.push(egg);

              app.currentDragObject.setPlaced(true);

        }
    }

if(egg) {
    $(egg).trigger('beforeEggTween', { callback: function() {
          app.focusLayer.hide();

          egg.moveToBottom();
          //app.currentDragObject.setScaleX(0.2);
        //  app.currentDragObject.setScaleY(0.2);
        app.currentDragObject.sizeChanged = false;
          app.chromTween = new Konva.Tween({
            node: app.currentDragObject,
            duration: 0.1,
            x: -55,
            y: -55,
            opacity: 1,
            scaleX: 0.9,
            scaleY: 0.9,
            onFinish: function() {
                app.layer.batchDraw();
                app.tempLayer.batchDraw();
                app.staticLayer.batchDraw();
            }
          });

          app.chromTween.play();
          app.ui.focus(egg, {focusOut: true,
                            onComplete: function() {
                                  app.focusLayer.show();

                                    if(egg.next) {

                                            app.ui.updateIcons(egg.next);
                                            app.ui.focus(egg.next,
                                              {focusOut: false,
                                              onComplete: function() {

                                              }});
                                          egg.next.moveToTop();
                                    } else {
                                        app.ui.playEndSequence(app.promptUser);
                                    }
                            }});
        }
  });
}

    return true;
},

scrollPage: function(egg) {
      if(!egg) return false;

      var layerCentre = (app.layer.y() / 2);
      var y =  layerCentre < egg.group.y() ? -egg.group.y() / 20 : egg.group.y() / 20;
      y = y * scrollDistance;

        app.tween = new Konva.Tween({
          node: app.layer,
          duration: 0.5,
          y: y,
          opacity: 1,
          onFinish: function() {
              app.layer.draw();
              app.tempLayer.draw();
              app.staticLayer.draw();
          }
      });

      if(app.timeout)
        clearTimeout(app.timeout);

      app.timeout = setTimeout(function() {
          app.tween.play();
      }, 10);

},
returnToContainer: function(icon, scaled) {

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

  app.layer.batchDraw();
  app.tempLayer.draw();
  app.staticLayer.draw();

  if(icon.inEgg) {
    icon.inEgg.chromos.remove(app.currentDragObject);
    app.ui.checkForEmptyEgg(icon.inEgg);
  }

  icon.setPlaced(false);

  if(icon.inEgg && icon.inEgg.prev) {
      app.ui.updateIcons(icon.inEgg.prev);
  }

  app.currentDragObject.sizeChanged = false;

  app.chromTween = new Konva.Tween({
    node: app.currentDragObject,
    duration: 0.3,
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    onFinish: function() {
        app.layer.batchDraw();
        app.tempLayer.batchDraw();
        app.staticLayer.batchDraw();
    }
  });

  app.chromTween.play();

  delete(icon.inEgg);// = null;
},

checkForEmptyEgg: function(egg) {
  if(egg.chromos.length === 0) {
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
    app.ui.updateIcons(sequence);
},
icon: {
        images: null,
        konvaWrappers: null,
        init: function() {
            app.ui.icon.konvaWrappers = {};
            app.sequences.forEach(function(s) {
              if(s) {
                  app.ui.icon.konvaWrappers[String(s)] = [];
              }
            });
        }
  },
hideUnusedIcons: function(inx, seqStr, egg) {

  var answerId = imageSources.sequences[seqStr].answerIds[inx];
  app.ui.icon.konvaWrappers[seqStr][inx].answerId = answerId;

  if(DEBUG) {
    console.log("Next egg");
    console.log(egg.next);
    console.log("Prev egg");
    console.log(egg.prev);
    console.log("Current egg");
    console.log(egg);
  }

  var eggAnswer = egg.prev ? egg.prev.canswerId : egg.canswerId;

  var _node = app.ui.icon.konvaWrappers[seqStr][inx];

  _node.show();

  if(DEBUG) {
    console.log("Current icon node");
    console.log(_node.name());
    console.log("Visible?: ");
    console.log(_node.visible());
  }
  if(eggAnswer) {
  try {
    if(imageSources.sequences[seqStr].
        links[eggAnswer].indexOf(answerId) === -1)
    {

    if(DEBUG) {
      if(egg.prev) {


        console.log("Prev: "+egg.prev.canswerId);
        console.log(" in > "+seqStr);
        console.log(imageSources.sequences[seqStr].links[eggAnswer].indexOf(answerId));
        console.log(' === ');
        console.log(answerId);
      }
    }

    if(DEBUG) console.log(eggAnswer+" hiding "+inx);

      _node.hide();
    //  _node.setX(5000); //place off stage

  }else {
    if(_node.getParent()) {
          _node.moveToTop();
    }

    //_node.show();
  }
} catch(e) {
  if(DEBUG) {
    console.log(e);
    console.log("Answer was: "+eggAnswer);
  }
}
}
},
playEndSequence: function(o) {

    o.onComplete();
},
updateIcons: function(egg) {
var sequence;
if(typeof egg === 'number') {
  sequence = egg;
} else {
  sequence = egg.sequence;
}
var seqStr = app.sequences[sequence];
loadCount[seqStr] = 0;

if(! imageSources.sequences[seqStr] ) return false;

if(! app.ui.icon.konvaWrappers) {
    app.ui.icon.init();
}

app.ui.clearIconMenu(iconMenu.group);

if(app.ui.icon.konvaWrappers[seqStr].length === 0) {

  var xchromPos = 12;
  var ychromPos = 163;
  var vSpace = 0; //iconVSpacing;
  var hSpace = 0;//cctXPos - iconHSpacing * 0.075;

app.ui.icon.images = app.ui.icon.images || {};
app.ui.icon.images[seqStr] = app.ui.icon.images[seqStr] || [];

imageSources.sequences[seqStr].icons.forEach(
  function(src, inx) {

  if(DEBUG) {
      console.log("Loading icon image: "+src);
  }

  app.ui.icon.images[seqStr][inx] = new Image();

  app.ui.icon.konvaWrappers[seqStr][inx] = new Konva.Image({
        x: xchromPos,
        y: ychromPos,
        image: app.ui.icon.images[seqStr][inx],
        width: iconWidth * iconHomeScale,
        height: iconHeight * iconHomeScale,
        name: 'chromosome_'+inx,
        draggable: true,
        fill: 'transparent'
  });

  app.ui.icon.konvaWrappers[seqStr][inx].sequence = sequence;

  app.ui.icon.konvaWrappers[seqStr][inx].setHomePos({x: xchromPos, y: ychromPos});
  app.ui.icon.konvaWrappers[seqStr][inx].setUIComponentType('icon');

  app.ui.icon.images[seqStr][inx].onload = function(e) {
        loadCount[seqStr] = loadCount[seqStr] + 1;
        iconMenu.group.add(app.ui.icon.konvaWrappers[seqStr][inx]);
        app.ui.icon.konvaWrappers[seqStr][inx].draw();
        app.ui.icon.konvaWrappers[seqStr][inx].moveToTop();

        app.ui.icon.konvaWrappers[seqStr][inx].on('mouseover', function() {
               document.body.style.cursor = 'move';
        });
        app.ui.icon.konvaWrappers[seqStr][inx].on('mouseout', function() {
               document.body.style.cursor = 'default';
        });

  };

  //iconMenu.group.draw();
  xchromPos += iconHSpacing;

  ychromPos += ((inx + 1) % iconsPerRow) === 0 ? vSpace : 0;
  xchromPos = ((inx + 1) % iconsPerRow) === 0 ? hSpace : xchromPos;
    //if(egg) {
        app.ui.hideUnusedIcons(inx, seqStr, egg);
  //  }
  }
);

  app.ui.icon.images[seqStr].forEach(function(img, inx) {
      app.ui.icon.images[seqStr][inx].src = urlBase + imageSources.sequences[seqStr].icons[inx];
  });

} else {
    app.ui.icon.konvaWrappers[seqStr].forEach(function(icon, inx) {
          if(DEBUG) {
            console.log("Reusing cached icons");
            console.log(icon);
          }

          icon.show();
      //  if(egg.next) {
            app.ui.hideUnusedIcons(inx, seqStr, egg);
      //  }
    });
}

//iconMenu.group.draw();
//staticLayer.draw();

if(focusedEgg.group.startingPosition && sequence == 1) {
    app.ui.focus(focusedEgg);
}
},
focusing: false,
focus: function(thisEgg, params) {
  if(!thisEgg.group.startingPosition) return false;
  if(app.ui.focusing) return false;

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
      thisEgg.group.moveTo(app.layer);
  } else {
      thisEgg.group.moveTo(app.focusLayer);
  }

  //if(app.currentDragObject)
  //console.log("Current parent before focus tween "+app.currentDragObject.parent.attrs.name);

  app.focusLayer.moveToTop();
  thisEgg.group.opacity(1);
  thisEgg.group.moveToTop();

  app.ui.scrollPage(params.reverseScroll ? thisEgg.prev : thisEgg.next);

  app.safeLabel = null;

  if(thisEgg.label) {
      app.safeLabel = thisEgg.label;
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
          //  resetButton.setListening(true);
          //  undoButton.setListening(true);
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

        app.ui.focusing = false;

  };
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

  app.groupTween = app.groupTween || [];

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

        app.ui.focusing = true;
    }
  });

    app.thread = setTimeout(function() {
        iconMenu.setListening(false);
      //  resetButton.setListening(false);
      //  undoButton.setListening(false);
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
};

Konva.Rect.prototype.group = null;
Konva.Rect.prototype.uiContainer = function(params) {
      this.group = new Konva.Group({
        x: params.x,
        y: params.y
      });

      this.group.add(this);
};

// icon settings
Konva.Image.prototype.setHomePos = function(params) {
        this.iconPos = params;
};

Konva.Image.prototype.getHomePos = function() {
        return this.iconPos;
};

Konva.Image.prototype.setPlaced = function(placed) {
        this.placed = placed;
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

Konva.Image.prototype.sizeChanged = false;
Konva.Node.prototype.sequence = 0;
// button functions
Konva.Rect.prototype.setUIComponentType = function(type) {
         this.uiComponentType = type;
};

Konva.Rect.prototype.getUIComponentType = function() {
        return this.uiComponentType;
};

Konva.Group.prototype.startingPosition = null;
Konva.Image.prototype.answerId = null;

Konva.Circle.prototype.canswerId = null;

// egg settings
Konva.Circle.prototype.initEgg = function(params) {
        this.chromos = params.chromos;
        this.next = params.next;
        this.prev = params.prev;
        var egg = this;

        this.group = new Konva.Group({
              x: params.x,
              y: params.y,
              name: egg.name() + '_group',
              id: egg.name() + '_group'
        });

        if(DEBUG) {
          console.log("added");
          console.log(egg.name());
        }
        this.group.startingPosition = {x: params.x, y: params.y};
        if(this.isPrecursor) {
          app.staticLayer.add(this.group);
        } else {
          app.layer.add(this.group);
        }
        this.group.add(egg);

        $(this).on("beforeEggTween", function(e, o){
            $(app.stage).trigger('touchEgg', { egg: e.target, callback: o.callback });
        });

        return this.group;
};

Konva.Circle.prototype.isPrecursor = false;
Konva.Circle.prototype.scrollPageOnDrop = null;
Konva.Circle.prototype.group = null;
Konva.Circle.prototype.label = null;

Konva.Text.prototype.startingPosition = null;
}
};

app.ui.setPrototypes();

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
  x: cctXPos + 25,
  y: cctYPos - 113,
      width: containerWidth,
      height: containerHeight,
      fill: containerFill,
      stroke: containerStroke,
      strokeWidth: 1,
      name: 'iconMenu',
});

iconMenu.uiContainer({
      x: cctXPos,
      y: cctYPos
});

var undoButton = new Konva.Rect({
  x: containerX + containerWidth - (iconWidth / 2),
  y: containerY,
  width: iconWidth / 2,
  height: iconHeight / 3,
  fill: buttonFillColor,
  stroke: containerStroke,
  strokeWidth: 2,
  name: 'undo',
  type: 'icon',
});

undoButton.on('mouseover', function() {
       document.body.style.cursor = 'pointer';
});
undoButton.on('mouseout', function() {
       document.body.style.cursor = 'default';
});

/*var undoText = new Konva.Text({
  x: containerX + containerWidth - (iconWidth / 2) + 15,
  y: containerY + 13,
    text: 'Undo',
    fontSize: 18,
     fontFamily: "'Corbel', verdana, sans-serif",
     fill: buttonLabelColor
});

var resetButton = new Konva.Rect({
  x: containerX + containerWidth - (iconWidth + 3),
  y: containerY,
  width: iconWidth / 2,
  height: iconHeight / 3,
  fill: buttonFillColor,
  stroke: containerStroke,
  strokeWidth: 2,
  name: 'reset',
});

resetButton.setUIComponentType('button');
undoButton.setUIComponentType('button');

resetButton.on('mouseover', function() {
       document.body.style.cursor = 'pointer';
});
resetButton.on('mouseout', function() {
       document.body.style.cursor = 'default';
});

var resetText = new Konva.Text({
    x: containerX + containerWidth - (iconWidth + 3) + 15,
    y: containerY + 13,
    text: 'Reset',
    fontSize: 18,
     fontFamily: "'Corbel', verdana, sans-serif",
     fill: buttonLabelColor,
});

iconMenu.group.add(undoButton);
iconMenu.group.add(undoText);

undoText.cache();
resetText.cache();

undoText.setListening(false);

iconMenu.group.add(resetButton);
iconMenu.group.add(resetText);

resetText.setListening(false);*/

app.staticLayer.add(iconMenu.group);
iconMenu.setListening(false);

var setPrecursor = function(pX, pY, i) {
      precursorImg.onload = function() {

      precursor = new Konva.Image({
            x: precursorX,
            y: precursorY,
            image: precursorImg,
            width: iconWidth / 1.7,
            height: iconHeight / 1.7,
            name: 'precursor_'+i,
            fill: 'transparent'
      });

      precursor.setUIComponentType('stillImage');
      app.staticLayer.add(precursor);
      };
};
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

        if(i === 0) {
              x = 28 + (circleDiameter / 2);
              y = circleDiameter + topOffset;

              var pX = x; // create local instance
              var pY = y;

              setPrecursor(pX, pY, i);

        } else if(i < 5) {
           x = problemPosFormula - (circleDiameter / 2);
           y = circleDiameter + yoff + topOffset;
           yoff += circleSpace;
        } else if(i < 16 && i % 2 == 1) {
           x = problemPosFormula  - circleDiameter * 1.5;
           y = circleDiameter + yoff + topOffset;
        } else if(i < 16 && i % 2 === 0) {
          x = problemPosFormula + circleDiameter / 2;

          yoff += circleSpace;
        } else if(i == 16) {
          x = problemPosFormula - circleDiameter * 2.8;
          y = circleDiameter + yoff + topOffset;
        } else if(i == 17) {
          x = problemPosFormula - circleDiameter * 0.2;
        } else if(i == 18) {
          x = problemPosFormula + circleDiameter * 1.2;
        }

        opacity = i > 1 ? 0.4 : 1.0;

        var egg = new Konva.Circle({
            radius: (circleDiameter / 2) * circleFocusMultiplier,
            stroke: circleStrokeColor,
            scaleX: 1 / circleFocusMultiplier,
            scaleY: 1 / circleFocusMultiplier,
            name : 'egg_' + i,
            id: 'egg_' + i,
            opacity: opacity,
            fill: circleDropColor,
        });

        egg.isPrecursor = i < 1;
        egg.sequence = i == 5 || i == 6 ? 5 : i;
        egg.scrollPageOnDrop = 'down';

        egg.initEgg({next: null, prev:  previousEgg, chromos: [], x: x, y: y});
        app.ui.setEggLabel(i, egg, 0, 0);

        if(previousEgg && egg) {
          previousEgg.next = egg;
        }

        previousEgg = egg;

        egg.group.moveToBottom();

        egg.cache();

        if(i === 1) {
          focusedEgg = egg;
        }

        egg = null;
    }

precursorImg.src = urlBase + imageSources.precursor;

app.ui.updateIcons(1);
//app.ui.focus(focusedEgg);

app.stage.add(app.staticLayer, app.layer, app.focusLayer, app.tempLayer);


app.layer.setListening(false);
app.layer.children.forEach(
  function(n) {
      n.opacity(0.2);
});

app.currentDragObject = null;
app.stage.on("dragstart", function(e){
    e.target.moveTo(app.tempLayer);
    app.currentDragObject = e.target;
        if(DEBUG) {
            console.log("Dragging");
            console.log(app.currentDragObject);
        }
    app.tempLayer.batchDraw();
    app.staticLayer.batchDraw();
    app.focusLayer.batchDraw();

});

app.promptUser = {
  onComplete: function() {
      var confirmed = bootbox.confirm("Save your work as a PDF [OK] or return to the demonstration [Cancel]?",
      function(confirmed) {
          if(confirmed === true) {
              $("#container").trigger('docReady');
          } else {
              app.layer.scaleX(1.0);
              app.layer.scaleY(1.0);
              app.layer.y(app.prevLayerY);
              app.staticLayer.show();
              app.focusLayer.show();
              app.tempLayer.show();
          }
      });
  }
};

var previousShape;
app.stage.on("dragmove", function(evt){

    var pos = app.stage.getPointerPosition();
    var shape = app.focusLayer.getIntersection(pos);
    app.tempLayer.moveToTop();
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
app.stage.on("dragend", function(e){
    var pos = app.stage.getPointerPosition();
    var shape = app.focusLayer.getIntersection(pos);

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

  app.ui.returnToContainer(e.target, iconHomeScale);
});

app.stage.on("dragenter", function(e){
    if(e.target.opacity < interactableThresholdOpacity) return false;

});

app.stage.on("dragleave", function(e){
  if(e.target.opacity < interactableThresholdOpacity) return false;

  if(e.target instanceof Konva.Circle) {
    e.target.fill(circleFillColor);
//    text.text('dragleave ' + e.target.name());
    //layer.draw();
  }
});



app.stage.on("dragover", function(e){
  if(e.target.opacity() < interactableThresholdOpacity) return false;

  if(DEBUG) {console.log("Over "+e.target.name());}

  if(app.sizeChangeOnDrop && !app.currentDragObject.sizeChanged) {
      app.currentDragObject.setScaleX(app.currentDragObject.scaleX() * app.sizeChangeOnDrop);
      app.currentDragObject.setScaleY(app.currentDragObject.scaleY() * app.sizeChangeOnDrop);

      app.currentDragObject.sizeChanged = true;

  }

  app.currentDragObject.setX(app.stage.getPointerPosition().x - ((app.currentDragObject.width() / 2) * app.sizeChangeOnDrop));
  app.currentDragObject.setY(app.stage.getPointerPosition().y - ((app.currentDragObject.height() / 2) * app.sizeChangeOnDrop));

  if(e.target instanceof Konva.Circle) {

        e.target.fill(circleHoverColor);
      //  text.text('dragover ' + e.target.name());

        app.focusLayer.draw();
  }
});

app.stage.on("drop", function(e){
  var pointerPos = app.stage.getPointerPosition();
  var sizeRevert = false;

  if(e.target.opacity() !== 1.0) {
      app.ui.returnToContainer(app.currentDragObject, iconHomeScale);
      return;
  }

  if(e.target instanceof Konva.Circle) {
        if(! app.ui.placeInEgg(e.target, pointerPos)) {
            app.ui.returnToContainer(app.currentDragObject, iconHomeScale);
        }
  }
});

app.stage.on("touchstart mouseover", function(e){
  //  console.log("fired mo ");
      if(e.target.opacity() < interactableThresholdOpacity) {
          return false;
      }
      var pos = app.stage.getPointerPosition();
      var shape = app.staticLayer.getIntersection(pos);

      if(shape && typeof shape.getUIComponentType === 'function') {
          if(shape.getUIComponentType() === 'button') {
              if(e.type === "touchstart") {
                    shape.fill(buttonClickColor);
              } else {
                    shape.fill(buttonHoverColor);
              }

              app.staticLayer.draw();
          }
      }
});

app.stage.on("mouseout", function(e){
      if(e.target.opacity() < interactableThresholdOpacity) {
          return false;
      }
      var shape = e.target;

      if(shape && typeof shape.getUIComponentType === 'function') {
          if(shape.getUIComponentType() === 'button') {
          if(DEBUG) {    console.log("mouseout");}
              shape.fill(buttonFillColor);
              app.staticLayer.draw();
          }
      }
});
app.stage.on("mousedown", function(e){
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
/*app.stage.on("touchend mouseup", function(e){
      if(e.target.opacity() < interactableThresholdOpacity) {
          return false;
      }

      var shape = e.target;
      if(shape && typeof shape.getUIComponentType === 'function') {
          if(shape.getUIComponentType() === 'button') {
              var name = shape.name();
              switch(name) {
                    case 'undo':
                        app.ui.undo();
                    break;
                    case 'reset':
                        window.location.reload();
              }

              shape.fill(buttonFillColor);
              app.staticLayer.draw();
          }
      }
});*/

// jquery events
$(app.stage).on('touchEgg', function(e, args){
		$("#labelme").css({left: args.egg.group.x(), top: args.egg.group.y()}).show();

    $("#labelme input").on('change', function(e) {
        if(!args.egg.label) {
            args.egg.label = $(args.egg.label).clone(args.egg.next.label);
            app.safeLabel = args.egg.label;
        }

        var str = args.egg.label.text();
        var type = $(e.target).prop('id');
        args.egg.label.text(str + "\n("+type+")");
        args.callback();
        $("#labelme").hide().find('input').prop('checked', false).off('change');
    });
});

DOMLabelWidth = $('#labelme').width();
DOMLabelHeight = $('#labelme').height();



}};

app.prevLayerY = 0;

/* convert output to PDF and download */
$(document).on('docReady', "#container", function() {

  app.layer.opacity(1.0);
  app.layer.moveToTop();
  app.staticLayer.hide();
  app.focusLayer.hide();
  app.tempLayer.hide();

  for(var i = 0; i < 19; i++) {
      var egg = app.stage.find("#egg_"+i)[0];
      egg.opacity(1.0);
      egg.group.opacity(1.0);
      egg.group.moveToTop();
  }

  app.prevLayerY = app.layer.y();
  app.layer.y(-135);
  app.layer.x(-150);
  app.layer.scaleX(1.25);
  app.layer.scaleY(1.25);
  app.layer.draw();

  var canv = app.layer.getCanvas();
  var imgData1 = canv.toDataURL('image/png');

  app.layer.x(-60);
  app.layer.y(-640);
  app.layer.draw();

  app.layer.scaleX(1.2);
  app.layer.scaleY(1.2);
  app.layer.draw();
  var imgData2 = canv.toDataURL('image/png');

  var pdf = new jsPDF('p','px','a4',false);

  pdf.addImage(imgData1, 'PNG', 0, 0, 645, 600);
  pdf.addPage();
  pdf.addImage(imgData2, 'PNG', 0, 0, 645, 600);
  pdf.save('meiosis.pdf');
  app.layer.hide();
  bootbox.alert("Thank you. The PDF is in your downloads folder. Click OK to complete another exercise.", function() { document.location.reload();});
}).on("click", "#tour", function(e) {
    e.preventDefault();
    $("#homeMenu").hide();
    $("body h1").addClass("h1_w_controls");
    $("#container, .meiosis-intro").show();
    app.run();
    function show_buttons() {
        $(".btn").show();
    };

    introJs.introJs().oncomplete(show_buttons).onexit(show_buttons).start();

}).on("click", "#begin", function(e) {
    e.preventDefault();
    $("#homeMenu").hide();
    $("body h1").addClass("h1_w_controls");
    $("#container, .btn").show();
    app.run();
    if(DEBUG) {
      app.ui.playEndSequence(app.promptUser);
    }
}).on("click", "#undo", function(e) {
    app.ui.undo();
}).on("click", "#reset", function(e) {
    window.location.reload();
});/*[0].addEventListener('DOMContentLoaded', function() {


});*/
