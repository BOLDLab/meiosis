(function(){
"use strict";

/**
 * @Author: ps158
 * @Date:   2017-02-02T10:13:46+11:00
 * @Last modified by:   ps158
 * @Last modified time: 2017-05-03T16:42:07+10:00
 */
require('konva');
require('bootstrap');

var DEBUG = false;

var app = {
  run: function() {

    app.sizeChangeOnDrop = 3;

    var width = 800;
    var height = 955;
    var circleDiameter = 145;
    var drop_areaSpace = 155;

    var borderColor = '#896724';
    var drop_areaFillColor = "#fd8";
    var drop_areaDropColor = '#eed'; //'#DAD7C5';
    var drop_areaHoverColor = 'transparent'; //'rgb(117,128,194)';
    var drop_areaStrokeColor = 'black';

    //var drop_areaFocusMultiplier = 2.65;

    var buttonLabelColor = '#F7DFAE';
    var buttonFillColor = '#467D7D';
    var buttonHoverColor = '#699494';
    var buttonClickColor = '#FFD874';

    var interactableThresholdOpacity = 0.8;
    var unfocusedDropAreaOpacity = 0;
    var topOffset = -100;

    var iconWidth = 140;
    var iconHeight = 140;
    var iconHomeScale = 0.9;
    var iconsPerRow = 4;

    var containerFill = '#FFF1D6'; //'rgb(201,200,184)';
    var containerStroke = 'black';
    var containerHeight = 500;
    var containerX = -21;
    var containerY = 280;
    var containerWidth = 615;

    var precursorX = 33;
    var precursorY = 112;

    //- (iconWidth * 0.25);
    var rightLabelOffset = 300; //-(drop_areaSpace / 2);
    var leftLabelOffset = -(drop_areaSpace);
    var scrollDistance = 10;
    var urlBase = ''; //'/test/meiosis/'

    var focusedDropArea = null;
    var focusPositionX = 410;
    var focusPositionY = 225;

    var textDropAreaLabels = [{
        x: -67,
        y: 75,
        text: 'Precursor Germ cells'
      },
      {
        x: 175,
        y: 55,
        text: 'Prophase I'
      },
      {
        x: 175,
        y: 55,
        text: 'Metaphase I'
      },
      {
        x: 175,//rightLabelOffset,
        y: 55,
        text: 'Anaphase I'
      },
      {
        x: 325,//rightLabelOffset,
        y: 35,
        text: 'Prophase II'
      },
      {
        x: 325,//rightLabelOffset,
        y: 35,
        text: 'Metaphase II'
      },
      {
        x: 325,//rightLabelOffset,
        y: 35,
        text: 'Anaphase II'
      },
      {
        x: 655,
        y: 35,
        text: 'Final Gamete'
      }
    ];

    var imageSources = {
      precursor: 'img/Precursor-Germ-Cell-80.png',
      sequences: {
        PROPHASE_I: {
          iconWidth: 150,
          focusPositionX: 280,
          focusPositionY: 55,
          icons: ['img/Prophase 1/PROPHASE 1 - A version-80.png',
            'img/Prophase 1/Prophase-1 -B version-80.png',
            'img/Prophase 1/Ptophase-1 -C- version-80.png'
          ],
          answerIds: ['c', 'x1', 'x2'],
            background: 'img/Hints/Prophase 1 greyscale.png',
        },
        METAPHASE_I: {
          // links to previous answers
          links: {
            c: ['c1', 'c2', 'x1'],
            x1: ['x2', 'x3', 'x4'],
            x2: ['x5', 'x6', 'x7']
          },
          iconWidth: 150,
          focusPositionX: 280,
          focusPositionY: 55,
        //  next_circle_bg_color: '#eed',
          icons: ['img/Metaphase 1/Ai-Metaphase-1-80.png',
            'img/Metaphase 1/Aii-Metaphase-1-80.png',
            'img/Metaphase 1/Aiii-Metaphase-1-80.png',
            'img/Metaphase 1/Bi-Metaphase-1-80.png',
            'img/Metaphase 1/Bii-Metaphase-1-80.png',
            'img/Metaphase 1/Biii-Metaphase-1-80.png',
            'img/Metaphase 1/Ci-Metaphase-1-80.png',
            'img/Metaphase 1/Cii-Metaphase-1-80.png',
            'img/Metaphase 1/Ciii-Metaphase-1-80.png'
          ],
          background: 'img/Hints/Metaphase 1 greyscale.png',
          answerIds: ['c1', 'c2', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7'],
        },
        ANAPHASE_I: {
          // links to previous answers [object keys are previous answers]
          links: {
            c1: ['c1', 'c2', 'x1'],
            c2: ['c1', 'c2', 'x1'],
            x1: ['c1', 'c2', 'x1'],
            x2: ['x2', 'x3', 'x4'],
            x3: ['x2', 'x3', 'x4'],
            x4: ['x2', 'x3', 'x4'],
            x5: ['x5', 'x6', 'x7'],
            x6: ['x5', 'x6', 'x7'],
            x7: ['x5', 'x6', 'x7'],
          },
          iconWidth: 150,
          focusPositionX: 280,
          focusPositionY: 55,
        //  next_circle_bg_color: '#fff',
          icons: ['img/Anaphase 1/Ai-Anaphase-1-80.png',
            'img/Anaphase 1/Aii-Anaphase-1-80.png',
            'img/Anaphase 1/Aiii-Anaphase-1-80.png',
            'img/Anaphase 1/Bi-Anaphase-1-80.png',
            'img/Anaphase 1/Bii-Anaphase-1-80.png',
            'img/Anaphase 1/Biii-Anaphase-1-80.png',
            'img/Anaphase 1/Ci-Anaphase-1-80.png',
            'img/Anaphase 1/Cii-Anaphase-1-80.png',
            'img/Anaphase 1/Ciii-Anaphase-1-80.png'
          ],
          background: 'img/Hints/Anaphase 1 greyscale.png',
          answerIds: ['c1', 'c2', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7'],
        },

        PROPHASE_II: {
          links: {
            c1: ['c1', 'c2', 'x1'],
            c2: ['c1', 'c2', 'x3'],
            x1: ['x1', 'x2', 'x3'],
            x2: ['x1', 'x2', 'x3'],
            x3: ['x3', 'x4', 'x5'],
            x4: ['x3', 'x4', 'x5'],
            x5: ['x5', 'x6', 'x7'],
            x6: ['x5', 'x6', 'x7'],
            x7: ['x5', 'x6', 'x7'],
          },
          iconWidth: 307,
          focusPositionX: 15,
          focusPositionY: 55,
          icons: ['img/Prophase 11/Ai Prophase 11 - 1 2.png',
              'img/Prophase 11/Aii Prophase 11 - 1 2.png',
              'img/Prophase 11/Aiii Prophase 11 - 1 2.png',
              'img/Prophase 11/Bi Prophase 11 - 1 2.png',
              'img/Prophase 11/Bii Prophase 11 - 1 2.png',
              'img/Prophase 11/Biii Prophase 11 - 1 2.png',
              'img/Prophase 11/Ci Prophase 11 - 1 2.png',
              'img/Prophase 11/Cii Prophase 11 - 1 2.png',
              'img/Prophase 11/Ciii Prophase 11 - 1 2.png',
            ],
          background: 'img/Hints/Prophase 11 greyscale.png',
          answerIds: ['c1','c2','x1','x2','x3','x4','x5','x6','x7']
        },
        METAPHASE_II: {
          links: {
            c1: ['c1', 'c2', 'x1'],
            c2: ['c1', 'c2', 'x3'],
            x1: ['x1', 'x2', 'x3'],
            x2: ['x1', 'x2', 'x3'],
            x3: ['x3', 'x4', 'x5'],
            x4: ['x3', 'x4', 'x5'],
            x5: ['x5', 'x6', 'x7'],
            x6: ['x5', 'x6', 'x7'],
            x7: ['x5', 'x6', 'x7'],
          },
          iconWidth: 300,
          focusPositionX: 15,
          focusPositionY: 55,
          icons: ['img/Metaphase 11/Ai Metaphase 11 - 1 2.png',
            'img/Metaphase 11/Aii Metaphase 11 - 1 2.png',
            'img/Metaphase 11/Aiii Metaphase 11 - 1 2.png',
            'img/Metaphase 11/Bi Metaphase 11 - 1 2.png',
            'img/Metaphase 11/Bii Metaphase 11 - 1 2.png',
            'img/Metaphase 11/Biii Metaphase 11 - 1 2.png',
            'img/Metaphase 11/Ci Metaphase 11 - 1 2.png',
            'img/Metaphase 11/Cii Metaphase 11 - 1 2.png',
            'img/Metaphase 11/Ciii Metaphase 11 - 1 2.png',
          ],
          background: 'img/Hints/Metaphase 11 greyscale.png',
          answerIds: ['c1','c2','x1','x2','x3','x4','x5','x6','x7']
        },
        ANAPHASE_II: {
          iconWidth: 300,
          focusPositionX: 15,
          focusPositionY: 55,
          links: {
            c1: ['c1', 'c2', 'x1'],
            c2: ['c1', 'c2', 'x3'],
            x1: ['x1', 'x2', 'x3'],
            x2: ['x1', 'x2', 'x3'],
            x3: ['x3', 'x4', 'x5'],
            x4: ['x3', 'x4', 'x5'],
            x5: ['x5', 'x6', 'x7'],
            x6: ['x5', 'x6', 'x7'],
            x7: ['x5', 'x6', 'x7'],
          },
          icons: ['img/Anaphase 11/Ai Anaphase 11 - 1 2.png',
          'img/Anaphase 11/Aii Anaphase 11 - 1 2.png',
          'img/Anaphase 11/Aiii Anaphase 11 - 1 2.png',
          'img/Anaphase 11/Bi Anaphase 11 - 1 2.png',
          'img/Anaphase 11/Bii Anaphase 11 - 1 2.png',
          'img/Anaphase 11/Biii Anaphase 11 - 1 2.png',
          'img/Anaphase 11/Ci Anaphase 11 - 1 2.png',
          'img/Anaphase 11/Cii Anaphase 11 - 1 2.png',
          'img/Anaphase 11/Ciii Anaphase 11 - 1 2.png',
          ],
          background: 'img/Hints/Anaphase 11 greyscale.png',
            answerIds: ['c1','c2','x1','x2','x3','x4','x5','x6','x7']
        },
        FINAL_GAMETES: {
          iconWidth: 615,
          focusPositionX: 15,
          focusPositionY: 55,
          links: {
            c1: ['c1', 'c2', 'x1'],
            c2: ['c1', 'c2', 'x3'],
            x1: ['x1', 'x2', 'x3'],
            x2: ['x1', 'x2', 'x3'],
            x3: ['x3', 'x4', 'x5'],
            x4: ['x3', 'x4', 'x5'],
            x5: ['x5', 'x6', 'x7'],
            x6: ['x5', 'x6', 'x7'],
            x7: ['x5', 'x6', 'x7'],
          },
          icons: ['img/Final Gametes/Ai Gamete - 1a 1b 2a 2b.png',
          'img/Final Gametes/Ai Gamete 11 - 1a 1b 2a 2b.png',
          'img/Final Gametes/Aii Gamete 11 - 1a 1b 2a 2b.png',
          'img/Final Gametes/AIII Gamete 11 - 1a 1b 2a 2b.png',
          'img/Final Gametes/Bi Gamete 11 - 1a 1b 2a 2b.png',
          'img/Final Gametes/Bii Gamete 11 - 1a 1b 2a 2b.png',
          'img/Final Gametes/Biii Gamete 11 - 1a 1b 2a 2b.png',
          'img/Final Gametes/Ci Gamete 11 - 1a 1b 2a 2b.png',
          'img/Final Gametes/Cii Gamete 11 - 1a 1b 2a 2b.png',
          'img/Final Gametes/Ciii Gamete 11 - 1a 1b 2a 2b.png',
          ],
          answerIds: ['c1','c2','x1','x2','x3','x4','x5','x6','x7'],
          background: 'img/Hints/Gamete 11 gs.png',
        }
      }
    };

    app.sequences = [null,
      'PROPHASE_I',
      'METAPHASE_I',
      'ANAPHASE_I',
      'PROPHASE_II',
      'METAPHASE_II',
      'ANAPHASE_II',
      'FINAL_GAMETES',
    ];

    var loadCount = [];

    app.stage = new Konva.Stage({
      container: '#container',
      width: width,
      height: height
    });

    var stageCenter = app.stage.width() / 2;

    app.layer = new Konva.Layer({
      name: 'drop_areaLayer'
    });

    app.tempLayer = new Konva.Layer({
      name: 'dragLayer'
    });

    app.staticLayer = new Konva.Layer({
      name: 'staticLayer'
    });

    app.focusLayer = new Konva.Layer({
      name: 'focusLayer'
    });

    // recursive opacity
    app.recOpacity = function(o, v, comparitor) {
      if (!comparitor) comparitor = null;
    /*  let _f = null;
      if(typeof comparitor === "string") {
          _f = function(n) {
              return n.name().indexOf(comparitor) !== -1;
          };
      } else {
          _f = function(n) {
              return typeof n === comparitor;
          };
      }*/

      o.children.forEach(function(n) {
        n.opacity(v);
        if (n.children /*&& _f(n)*/) {
          app.recOpacity(n, v);
        }
      });
    };

    app.shuffle =
      /**
      * Shuffles array in place.
      * @param {Array} a items The array containing the items.
      from: http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array#answer-6274381
      */
      function shuffle(o) {
        if (DEBUG) {
          console.log("Before shuffle");
          console.log(o.icons);
          console.log(o.answerIds);
        }
        let j, x, i, xa;
        for (let i = o.icons.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = o.icons[i - 1];
          xa = o.answerIds[i - 1];
          o.icons[i - 1] = o.icons[j];
          o.icons[j] = x;
          o.answerIds[i - 1] = o.answerIds[j];
          o.answerIds[j] = xa;
        }
        if (DEBUG) {
          console.log("After shuffle");
          console.log(o.icons);
          console.log(o.answerIds);
        }
      };

    var undoHistory = [];

    var DOMLabelWidth = 0; // set with jquery
    var DOMLabelHeight = 0;

    // evaluate dimensions
    var problemPosFormula = app.stage.width() - 230;
    var cctXPos = containerX;
    var cctYPos = containerY;
    var iconHSpacing = iconWidth * 0.65;
    var iconVSpacing = iconHeight * 0.8;
    //var containerWidth = (iconWidth * iconsPerRow) * (iconHomeScale - 0.17);

    app.ui = {

      setDropAreaLabel: function(i, drop_area, x, y) {
        if (!textDropAreaLabels[i]) return false;

        var text = new Konva.Text({
          fill: '#1F325C',
          x: textDropAreaLabels[i].x,
          y: textDropAreaLabels[i].y,
          fontSize: '14'
        });

        text.startingPosition = {
          x: textDropAreaLabels[i].x,
          y: textDropAreaLabels[i].y
        };
        text.text(textDropAreaLabels[i].text);

        drop_area.group.add(text);
        drop_area.label = text;

        app.ui.debugRect(x + textDropAreaLabels[i].x, y + textDropAreaLabels[i].y, text.getWidth(), text.getHeight());
      },

      undo: function() {
        if(DEBUG) {
            console.log("UNDO HISTORY:");
            console.log(undoHistory);
        }
        if(undoHistory.length === 0) {
          return false;
        }

        var drop_area = undoHistory.pop();
        console.log(drop_area);

        if(drop_area.sequence < 4) {
            precursor.show();
            precursor.drop_area.show();
            precursor.drop_area.label.show();
          //  precursor.group.show();
        } else {
            precursor.hide();
            precursor.drop_area.hide();
            precursor.drop_area.label.hide();
          //  precursor.group.hide();
        }

        if (drop_area) {
          app.ui.clearIconMenu();

          if (drop_area.chromos.length > 0) {
            var ret = drop_area.chromos.pop();
            console.log("Popped most recent::");
            console.log(ret);
            app.ui.returnToContainer(ret, iconHomeScale);
          }

          if (drop_area.chromos.length === 0) {
            //undoHistory.pop();

            app.ui.resetMenuOptions(drop_area);

          //  drop_area.fill(drop_areaFillColor);
            drop_area.opacity(1.0);

            var str = drop_area.label.text();

            var dipi = str.indexOf("\n(hap)");
            var hapi = str.indexOf("\n(dip)");

            var pos = dipi > 0 ? dipi : hapi;

            if (pos > 0) {
              str = str.substr(0, pos);
              drop_area.label.setText(str);
            }

            if (drop_area.prev && !drop_area.prev.droppable) {
              drop_area.prev.opacity(1.0);
              drop_area.prev.canswerId = null;
              app.ui.toggleAllIconsDraggable(drop_area.prev, true);
            }
            if (drop_area.next) {
              drop_area.next.opacity(unfocusedDropAreaOpacity);
              drop_area.next.canswerId = null;
              app.ui.toggleAllIconsDraggable(drop_area.next, false);
            }

            app.layer.batchDraw();

            app.ui.focus(drop_area.next, {
              focusOut: true,
              onComplete: function() {
                app.ui.focus(drop_area, {
                  focusOut: false,
                  reverseScroll: true
                });
              }
            });
          }


        }
      },

      debugRect: function(x, y, w, h) {
        if (DEBUG) {

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

        app.ui.getOrphanedIcons(layer1).forEach(function(icon) {
          if (DEBUG) {
            console.log('moving icon ' + icon.name() + ' from ' + layer1.name() + '  to ' + layer2.name());
          }
          icon.moveTo(layer2);
          icon.moveToTop();
        });
      },

      toggleAllIconsDraggable: function(drop_area, draggable) {
        if (!drop_area || !drop_area.chromos) return false;

        if (typeof draggable !== 'boolean') {
          draggable = true;
        }

        drop_area.chromos.forEach(function(chrom) {
          chrom.draggable(draggable);
        });
      },

      placeInDropArea: function(drop_area, pointerPos) {
        drop_area.canswerId = app.currentDragObject.answerId;
        var prevDropArea = drop_area.prev;
        //console.log(drop_area);

        //console.log("DROP INDEX: "+drop_area.sequence);

        if(drop_area.sequence < 3) {
            precursor.show();
            precursor.drop_area.show();
            precursor.drop_area.label.show();
          //  precursor.group.show();
        } else {
            precursor.hide();
            precursor.drop_area.hide();
            precursor.drop_area.label.hide();
          //  precursor.group.hide();
        }

        if (prevDropArea) {
          if (prevDropArea.chromos.length > 0 || prevDropArea.droppable) {
            if (drop_area.next && drop_area.next === app.currentDragObject.inDropArea) {
              return false;
            }

            if (!prevDropArea.droppable) {
              app.ui.toggleAllIconsDraggable(prevDropArea, false);
            }

            if (app.ui.allIconsPlaced()) {
              app.ui.toggleAllIconsDraggable(drop_area, true);
            }


            app.currentDragObject.inDropArea = drop_area;

        //    undoHistory.push(drop_area);

            app.currentDragObject.setPlaced(true);
          }
        }

        if (drop_area) {
          undoHistory.push(drop_area);
          drop_area.chromos.push(app.currentDragObject);

          $(drop_area).trigger('beforeDropAreaTween', {
            callback: function() {
              app.focusLayer.hide();

              drop_area.moveToBottom();

              if(DEBUG) {
                console.log("Changing circle fill color to: "+app.currentDragObject.next_circle_bg_color);
                console.log(app.currentDragObject);
              }

              app.currentDragObject.sizeChanged = false;
              app.chromTween = new Konva.Tween({
                node: app.currentDragObject,
                duration: 0.3,
                opacity: 1,
                width: drop_area.placementOffset.w,
                height: drop_area.placementOffset.h,
                x: drop_area.placementOffset.x,
                y: drop_area.placementOffset.y,
                onFinish: function() {
                  app.layer.draw();
                  app.tempLayer.draw();
                  app.staticLayer.draw();
                }
              });

              app.chromTween.play();
              app.ui.focus(drop_area, {
                focusOut: true,
                onComplete: function() {
                  app.focusLayer.show();
                  drop_area.hide();
                  if (drop_area.next) {

                    app.ui.updateIcons(drop_area.next);
                    app.ui.focus(drop_area.next, {
                      focusOut: false,
                      onComplete: function() {

                      }
                    });
                    drop_area.next.moveToTop();
                  } else {
                    app.ui.playEndSequence(app.showDocumentLayout);
                    $("#download-pdf").show();
                    $("button#pdf, button#undo").removeClass("active").addClass("disabled").off("click");
                    $("button#reset").removeClass("disabled");
                  }
                }
              });
            }
          });
        }

        return true;
      },

      scrollPage: function(drop_area) {
        if (!drop_area) return false;

        var layerCentre = (app.layer.y() / 2);
        var y = layerCentre < drop_area.group.y() ? -drop_area.group.y() / 20 : drop_area.group.y() / 20;
        y = y * scrollDistance;

        app.tween = new Konva.Tween({
          node: app.layer,
          duration: 0.1,
          y: y,
          opacity: 1,
          onFinish: function() {
            app.layer.draw();
            app.tempLayer.draw();
            app.staticLayer.draw();
          }
        });

        if (app.timeout)
          clearTimeout(app.timeout);

        app.timeout = setTimeout(function() {
          app.tween.play();
        }, 10);

      },
      returnToContainer: function(icon, scaled) {
        //console.log(icon);
        if (icon.getWidth() !== icon.displayWidth) {
          //icon.setWidth(iconWidth * scaled);
          icon.setWidth(icon.displayWidth);
        }

        if (icon.getHeight() !== iconHeight) {
          //icon.setHeight(iconHeight * scaled);
          icon.setHeight(iconHeight);
        }

        icon.moveTo(iconMenu.group);
        icon.moveToTop();
        icon.show();
        //var index = Number(icon.name().split('_')[1]);

        icon.setX(icon.getHomePos().x);
        icon.setY(icon.getHomePos().y);

        app.layer.batchDraw();
        app.tempLayer.draw();
        app.staticLayer.draw();

        if (icon.inDropArea) {
          icon.inDropArea.chromos.remove(app.currentDragObject);
          app.ui.checkForEmptyDropArea(icon.inDropArea);
        }

        icon.setPlaced(false);

        if (icon.inDropArea && icon.inDropArea.prev) {
          app.ui.updateIcons(icon.inDropArea.prev);
        }

        app.currentDragObject.sizeChanged = false;

        app.chromTween = new Konva.Tween({
          node: app.currentDragObject,
          duration: 0.1,
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

        delete(icon.inDropArea); // = null;
      },

      checkForEmptyDropArea: function(drop_area) {
        if (drop_area.chromos.length === 0) {
        //  drop_area.fill(drop_areaFillColor);
          if (drop_area.next) {
            drop_area.next.opacity(unfocusedDropAreaOpacity);
          }
          if (drop_area.prev) {
            drop_area.prev.opacity(1.0);

            drop_area.prev.chromos.forEach(function(chrom) {
                  chrom.draggable(true);
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
            if (s) {
              app.ui.icon.konvaWrappers[String(s)] = [];
            }
          });
        }
      },
      hideUnusedIcons: function(inx, seqStr, drop_area) {

        var answerId = imageSources.sequences[seqStr].answerIds[inx];
        app.ui.icon.konvaWrappers[seqStr][inx].answerId = answerId;

        if (DEBUG) {
          console.log("Next drop_area");
          console.log(drop_area.next);
          console.log("Prev drop_area");
          console.log(drop_area.prev);
          console.log("Current drop_area");
          console.log(drop_area);
        }

        var drop_areaAnswer = drop_area.prev ? drop_area.prev.canswerId : drop_area.canswerId;

        var _node = app.ui.icon.konvaWrappers[seqStr][inx];

        _node.show();

        if (DEBUG) {
          console.log("Current icon node");
          console.log(_node.name());
          console.log("Visible?: ");
          console.log(_node.visible());
        }
        if (drop_areaAnswer) {
          try {
            if (imageSources.sequences[seqStr].links[drop_areaAnswer].indexOf(answerId) === -1) {

              if (DEBUG) {
                if (drop_area.prev) {
                  console.log("Prev: " + drop_area.prev.canswerId);
                  console.log(" in > " + seqStr);
                  console.log(imageSources.sequences[seqStr].links[drop_areaAnswer].indexOf(answerId));
                  console.log(' === ');
                  console.log(answerId);
                }
              }

            } else {
              if (_node.getParent()) {
                _node.moveToTop();
              }

              //_node.show();
            }
          } catch (e) {
            if (DEBUG) {
              console.log(e);
              console.log("Answer was: " + drop_areaAnswer);
            }
          }
        }
      },
      playEndSequence: function(o) {

        o.onComplete();
      },
      updateIcons: function(drop_area) {
        var sequence;
        if(DEBUG) {
            console.log("Home Scale on call: "+iconHomeScale);
        }
        if (typeof drop_area === 'number') {
          sequence = drop_area;
        //  console.log("SEQ WAS NO.");
        } else {
          sequence = drop_area.sequence;
          //console.log("SEQ WAS OBJ.");
        }
      //  console.log(sequence);
        var seqStr = app.sequences[sequence];
        loadCount[seqStr] = 0;

        if (!imageSources.sequences[seqStr]) return false;

        if(typeof imageSources.sequences[seqStr].next_circle_bg_color === 'undefined') {
            //imageSources.sequences[seqStr].next_circle_bg_color = drop_areaFillColor;
            if(DEBUG) {
                console.log("SET color: "+imageSources.sequences[seqStr].next_circle_bg_color);
            }
        }

        if (!app.ui.icon.konvaWrappers) {
          app.ui.icon.init();
        }

        app.ui.clearIconMenu(iconMenu.group);

        if (app.ui.icon.konvaWrappers[seqStr].length === 0) {

          var xchromPos = 25;
          var ychromPos = 108;
         //iconVSpacing;
          var hSpace = 5; //cctXPos - iconHSpacing * 0.075;

          app.ui.icon.images = app.ui.icon.images || {};
          app.ui.icon.images[seqStr] = app.ui.icon.images[seqStr] || [];

          app.shuffle(imageSources.sequences[seqStr]);
          var drop_areaAnswer = drop_area.prev ? drop_area.prev.canswerId : drop_area.canswerId;

          if(DEBUG) {
              console.log("Icon array length: "+imageSources.sequences[seqStr].icons.length);
          }
          let iconWidth = imageSources.sequences[seqStr].iconWidth;

          if (iconWidth >= 500) {
              iconsPerRow = 1;
          } else if (iconWidth >= 300) {
              iconsPerRow = 2;
          } else {
              iconsPerRow = 4;
          }

          var ac = 0;
          imageSources.sequences[seqStr].icons.forEach(
            function(src, inx) {
              console.log("STRING IS: "+seqStr);
              var answerId = imageSources.sequences[seqStr].answerIds[inx];
              try {
              if (!drop_areaAnswer || imageSources.sequences[seqStr].links[drop_areaAnswer].indexOf(answerId) !== -1) {
                if (DEBUG) {
                  console.log("Loading icon image: " + src);
                }
                ac = ac + 1;
                app.ui.icon.images[seqStr][inx] = new Image();
            //    console.log(app.ui.icon.images[seqStr][inx].naturalWidth);
              if (DEBUG) {
                console.log(imageSources.sequences[seqStr].iconWidth);
              }
                app.ui.icon.konvaWrappers[seqStr][inx] = new Konva.Image({
                  x: xchromPos,
                  y: ychromPos,
                  image: app.ui.icon.images[seqStr][inx],
                  width: imageSources.sequences[seqStr].iconWidth,
                  height: iconHeight,
                  name: 'chromosome_' + inx,
                  draggable: true,
                  fill: 'transparent'
                });
                app.ui.icon.konvaWrappers[seqStr][inx].displayWidth = imageSources.sequences[seqStr].iconWidth;
                app.ui.icon.konvaWrappers[seqStr][inx].sequence = sequence;
                app.ui.icon.konvaWrappers[seqStr][inx].answerId = answerId;
                if (DEBUG) {
                    console.log("Sequence 1017");
                    console.log(app.ui.icon.konvaWrappers[seqStr][inx].sequence);
                }
                app.ui.icon.konvaWrappers[seqStr][inx].next_circle_bg_color = imageSources.sequences[seqStr].next_circle_bg_color;

                app.ui.icon.konvaWrappers[seqStr][inx].setHomePos({
                  x: xchromPos,
                  y: ychromPos
                });
                app.ui.icon.konvaWrappers[seqStr][inx].setUIComponentType('icon');

                app.ui.icon.images[seqStr][inx].onload = function(e) {

                  app.ui.icon.konvaWrappers[seqStr][inx].naturalWidth = this.naturalWidth;

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

                var vSpace = 170;
                xchromPos += imageSources.sequences[seqStr].iconWidth;
                if(DEBUG) {
                  console.log("Index count: "+inx);
                }
                if(ac % iconsPerRow === 0) {
                  ychromPos += vSpace;
                  xchromPos = 25;
                }

              }
            } catch(error) {
                console.err(error);
                bootbox.alert(error);
                return false;
            }
            }
          );

          if(DEBUG) {
              console.log("AC count: "+ac);
          }

        /*  if(ac > iconsPerRow) {
              iconHomeScale = 0.5;
          } else {
              iconHomeScale = 1;
          }*/

          if(DEBUG) {
              console.log("Konva length: "+app.ui.icon.konvaWrappers[seqStr].length);
          }

  /*        app.ui.icon.konvaWrappers[seqStr].forEach(function(o, i) {
              //  o.sizeChangeOnDrop = iconHomeScale + 1;
                //o.hSpacing = i > 0 ? hSpace * iconHomeScale : 0;
                if(DEBUG) {
                  console.log("HSpacing = "+o.hSpacing+" ["+i+"]");
                }
                o.setWidth(iconWidth * iconHomeScale);
                o.setHeight(iconHeight * iconHomeScale);
                if(DEBUG) {
                    console.log("Modulus = "+ (i % iconsPerRow));
                }
                if(iconHomeScale < 1 && i > 1 && i % (iconsPerRow + 1) !== 0) {
                    o.setX(o.x() + hSpace / 2);
                }
          });*/

          if(DEBUG) {
              console.log("Home Scale: "+iconHomeScale);
          }

          app.ui.icon.images[seqStr].forEach(function(img, inx) {
              app.ui.icon.images[seqStr][inx].src = urlBase + imageSources.sequences[seqStr].icons[inx];
          });

        } else {
          app.ui.icon.konvaWrappers[seqStr].forEach(function(icon, inx) {
            if (DEBUG) {
              console.log("Reusing cached icons");
              console.log(icon);
            }

            icon.show();
            //  if(drop_area.next) {
            app.ui.hideUnusedIcons(inx, seqStr, drop_area);
            //  }
          });
        }

        if (sequence == 1) {
          app.ui.focus(focusedDropArea);
        }
      },
      focusing: false,
      focus: function(thisDropArea, params) {
        if (!thisDropArea.group.startingPosition) {
          console.log("Warning: No starting position");
          console.log(thisDropArea.group);
          return false;
        }
        thisDropArea.show();
        if (app.ui.focusing) return false;
        //thisDropArea.bg_image.src = thisDropArea.img_url;
        //thisDropArea.fillPatternImage = thisDropArea.bg_image;
      //  thisDropArea.moveToTop();

        if (!params) {
          params = {
            focusOut: false,
            onComplete: null,
            reverseScroll: false
          };
        }

        if (!thisDropArea) return false;

        var x;
        var y;

        x = params.focusOut ? thisDropArea.group.startingPosition.x : thisDropArea.focusPosition.x;
        y = params.focusOut ? thisDropArea.group.startingPosition.y : thisDropArea.focusPosition.y;

        //console.log("FOCUS POS: x: "+x+" y: "+y);

        if (params.focusOut) {
          thisDropArea.group.moveTo(app.layer);
        } else {
          thisDropArea.group.moveTo(app.focusLayer);
        }


        //if(app.currentDragObject)
        //console.log("Current parent before focus tween "+app.currentDragObject.parent.attrs.name);

        app.focusLayer.moveToTop();
        app.recOpacity(thisDropArea.group, 1);
        thisDropArea.group.moveToTop();

        app.ui.scrollPage(params.reverseScroll ? thisDropArea.prev : thisDropArea.next);

        app.safeLabel = null;

        if (thisDropArea.label) {
          app.safeLabel = thisDropArea.label;
        } else if (thisDropArea.next.label) {
          app.safeLabel = thisDropArea.next.label;
          app.safeLabel.moveTo(thisDropArea.next.group);
        }

        app.drop_areaTween = new Konva.Tween({
          node: thisDropArea,
          duration: 0.1,
        //  fill: drop_areaFillColor,
          opacity: params.focusOut ? unfocusedDropAreaOpacity : 1,
          onFinish: function() {
            if (app.safeLabel) {
              app.safeLabel.moveTo(thisDropArea.group);
            }
            iconMenu.setListening(true);

            delete(app.drop_areaTween);
            delete(app.safeLabel);
            delete(app.groupTween);
          }
        });

        app.playDropAreaTween = function() {
          if (app.drop_areaTween) {

            app.drop_areaTween.play();

          }

          app.ui.focusing = false;

        };
        if (app.safeLabel) {
          var s = app.safeLabel.text();
          var c = (s.match(/\n/g) || []).length;

          var n = thisDropArea.focusLabelPosition.y - (12 * c);

          app.textTween = new Konva.Tween({
            node: app.safeLabel,
            duration: 0.1,
            x: params.focusOut ? app.safeLabel.startingPosition.x : thisDropArea.focusLabelPosition.x,
            y: params.focusOut ? app.safeLabel.startingPosition.y : n,
            onFinish: function() {
              app.playDropAreaTween();
            }
          });
        }

        app.groupTween = app.groupTween || [];

        if (typeof app.groupTween.destroy === 'function') {
          app.groupTween.destroy();
        }

        app.groupTween = new Konva.Tween({
          node: thisDropArea.group,
          duration: 0.5,
          x: x,
          y: y,
          easing: Konva.Easings.BackEaseIn,
          opacity: params.focusOut ? unfocusedDropAreaOpacity : 1,
          scaleX: params.focusOut ? 1 : thisDropArea.focusMultiplier,
          scaleY: params.focusOut ? 1 : thisDropArea.focusMultiplier,
          onFinish: function() {

            if(!params.focusOut) {
              //  thisDropArea.cache();
            }

            app.textTween.play();

            if (params.onComplete) {
              params.onComplete();
            }

          /*  if(params.focusOut) {
              thisDropArea.image.show();
            } else {
              thisDropArea.image.hide();

            }*/

            app.ui.focusing = true;
          }
        });

        app.thread = setTimeout(function() {
          iconMenu.setListening(false);
          app.groupTween.play();

        }, 50);

        focusedDropArea = thisDropArea;
        thisDropArea.cache();
        return this;
      },

      setPrototypes: function() {

        Array.prototype.remove = function(v) {
          if (this.indexOf(v) != -1) {
            this.splice(this.indexOf(v), 1);
            return true;
          }
          return false;
        };

        Image.prototype.drop_area = null;

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

        Konva.Image.prototype.naturalWidth = null;
        Konva.Image.prototype.displayWidth = null;

        Konva.Image.prototype.sizeChanged = false;
        Konva.Node.prototype.sequence = 0;

        Konva.Image.prototype.sizeMultiplier = 1;
        Konva.Image.prototype.hSpacing = 40;

        // button functions
        Konva.Rect.prototype.setUIComponentType = function(type) {
          this.uiComponentType = type;
        };

        Konva.Rect.prototype.getUIComponentType = function() {
          return this.uiComponentType;
        };

        Konva.Group.prototype.startingPosition = null;
        Konva.Image.prototype.answerId = null;

        Konva.Shape.prototype.canswerId = null;
        Konva.Shape.prototype.focusPosition = {x: 0, y:0};
        Konva.Shape.prototype.droppable = true;
        Konva.Shape.prototype.focusMultiplier = 2.65;
        Konva.Shape.prototype.placementOffset = { x: -15, y: -15, w: 120, h: 120};
        Konva.Shape.prototype.focusLabelPosition = { x: -80, y: 67};
        Konva.Shape.prototype.bg_image = null;
        Konva.Shape.prototype.img_url = null;
        // drop_area settings
        Konva.Shape.prototype.initDropArea = function(params) {
          this.chromos = params.chromos;
          this.next = params.next;
          this.prev = params.prev;
          var drop_area = this;

          this.group = new Konva.Group({
            x: params.x,
            y: params.y,
            name: drop_area.name() + '_group',
            id: drop_area.name() + '_group'
          });

          if (DEBUG) {
            console.log("added");
            console.log(drop_area.name());
            console.log("FP: ");
            console.log(params.focusPosition);
          }
          this.group.startingPosition = {
            x: params.x,
            y: params.y
          };

          this.focusPosition = params.focusPosition;

          if (!this.droppable) {
            app.staticLayer.add(this.group);
          } else if (!this.background) {
            app.layer.add(this.group);
          }
            this.group.add(drop_area);

          $(this).on("beforeDropAreaTween", function(e, o) {
            $(app.stage).trigger('touchDropArea', {
              drop_area: e.target,
              callback: o.callback
            });
          });

          return this.group;
        };

        Konva.Shape.prototype.scrollPageOnDrop = null;
        Konva.Shape.prototype.group = null;
        Konva.Shape.prototype.label = null;

        Konva.Text.prototype.startingPosition = null;
      }
    };

    Konva.Shape.prototype.liveLoadDropArea = function(params) {
        this.initDropArea(params);

        this.group.draw();
        this.group.moveToTop();
    };

    app.ui.setPrototypes();
    //images = [];

    app.sequences.forEach(function(el, key) {
      if (el !== null) {
        loadCount[el] = 0;
      }
    });

    var text = new Konva.Text({
      fill: 'black'
    });

    // setup chromosome container
    var iconMenu = new Konva.Rect({
      x: cctXPos + 50,
      y: cctYPos - 170,
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

    app.staticLayer.add(iconMenu.group);
    iconMenu.setListening(false);

    var setPrecursor = function(pX, pY, i, drop_area) {
      precursorImg.onload = function() {

        precursor = new Konva.Image({
          x: precursorX,
          y: precursorY,
          image: precursorImg,
          width: 150,
          height: 150,
          name: 'precursor_' + i,
          fill: 'transparent'
        });

        precursor.setUIComponentType('stillImage');
        precursor.drop_area = drop_area;
        app.staticLayer.add(precursor);
      };
    };
    // setup drop_area interface
    var yoff = 35;
    var opacity;
    var drop_areaMap = [];
    var precursorImg = new Image();
    var precursor;
    var previousDropArea;

    let newCircleDropArea = function(params) {
      let drop_area = new Konva.Circle({
        radius: circleDiameter / 2,
        stroke: drop_areaStrokeColor,
        name: 'drop_area_' + params.i,
        id: 'drop_area_' + params.i,
        opacity: opacity,
        //fill: drop_areaFillColor,
      });


        return drop_area;
    };

    function loadBackgroundImages(callback) {
        let loadedImages = 0;
        let images = [];
        for(let i = 1; i < app.sequences.length; i++) {
          if(imageSources.sequences[app.sequences[i]]) {
              images[i] = new Image();

              images[i].onload = function() {


              //  console.log("LI: "+i+ " len: " + app.sequences.length-1);
                if(i === app.sequences.length-1) {
                //  console.log("before call SDFjladsfofjdoas;");
              //    console.log(images[i]);
                  callback(images);
                }

              };

              images[i].src = imageSources.sequences[app.sequences[i]].background;
        }
      }
    }

    loadBackgroundImages(function(images) {
    let drop_area;

    let focusPos = {};
    for (let i = 0; i < app.sequences.length; i++) {

    if(DEBUG) {
      console.log("Processing sequence: ");
      console.log(app.sequences[i]);
    }

      opacity = i > 1 ? unfocusedDropAreaOpacity : 1.0;

      let x;
      let y;

      if (i === 0) {
        x = 109;
        y = 195;

        var pX = x; // create local instance
        var pY = y;

        drop_area = newCircleDropArea({x: x, y: y, i:i});
        setPrecursor(pX, pY, i, drop_area);
      } else if(i < 4) {
        x = problemPosFormula - 200;
        y = circleDiameter + yoff + topOffset;
        yoff += drop_areaSpace;

        drop_area = new Konva.Image({
            name: 'drop_area_' + i,
            id: 'drop_area_' + i,
            image: images[i],
            width: 150,
            height: 150
        });

        if(i > 0 && i < 4) {
              drop_area.placementOffset = {x: 0, y:0, w: 150, h: 150};
        }

        drop_area.focusMultiplier = 2.2;
      } else if(i > 3 && i < 7) {
        x = problemPosFormula - 280 ;
        y = circleDiameter + yoff + topOffset;

        yoff += drop_areaSpace + 30;

        drop_area = new Konva.Image({
            name: 'drop_area_' + i,
            id: 'drop_area_' + i,
            image: images[i],
            width: 307,
            height: 159,
        });

        drop_area.focusMultiplier = 2;
        drop_area.placementOffset = {x: 0, y:0, w: 307, h: 159};
        drop_area.focusLabelPosition.x = -140;
        drop_area.focusLabelPosition.y = 90;
        //focusPos = { x: -150, y: 195 };
        //drop_area.focusPosition.y = 195;
      } else {
        x = problemPosFormula - 460;
        y = circleDiameter + yoff + topOffset;
        yoff += drop_areaSpace;

        drop_area = new Konva.Image({
            name: 'drop_area_' + i,
            id: 'drop_area_' + i,
            image: images[i],
            width: 615,
            height: 159,
        });

        drop_area.focusMultiplier = 1.0;
        drop_area.placementOffset = {x: 42, y:0, w: 615, h: 150};
        drop_area.focusLabelPosition.x = 0;
        drop_area.focusLabelPosition.y = -20;
      }

      if(DEBUG) {
          console.log("Setup index: "+i);
          console.log("X: "+x+" Y:"+y);
      }

      drop_area.droppable = i > 0;
      drop_area.sequence = i;
      drop_area.scrollPageOnDrop = 'down';

      if(drop_area.droppable && imageSources.sequences[app.sequences[i]]) {
          focusPos =   {
                x: imageSources.sequences[app.sequences[i]].focusPositionX,
                y: imageSources.sequences[app.sequences[i]].focusPositionY
          };
      }

      drop_area.initDropArea({
        next: null,
        prev: previousDropArea,
        chromos: [],
        x: x,
        y: y,
        focusPosition: focusPos
      });

      if (i === 1) {
        //console.log("setting FOCUSED AREA");
        focusedDropArea = drop_area;
      }

      app.ui.setDropAreaLabel(i, drop_area, 0, 0);

      if (previousDropArea && drop_area) {
        previousDropArea.next = drop_area;
      }

      previousDropArea = drop_area;

      drop_area.group.moveToBottom();

    //  drop_area.cache();



      drop_area = null;
    }

    precursorImg.src = urlBase + imageSources.precursor;

    app.ui.updateIcons(1);
    //app.ui.focus(focusedDropArea);

    app.stage.add(app.staticLayer, app.layer, app.focusLayer, app.tempLayer);

    app.layer.setListening(false);

    app.layer.children.forEach(
        function(n) {
          n.opacity(0);
        });
      });
    // hide all drop_areas
  /*  */

    app.currentDragObject = null;
    app.stage.on("dragstart", function(e) {
      e.target.moveTo(app.tempLayer);
      app.currentDragObject = e.target;
      if (DEBUG) {
        console.log("Dragging");
        console.log(app.currentDragObject);
      }
      app.tempLayer.batchDraw();
      app.staticLayer.batchDraw();
      app.focusLayer.batchDraw();

    });

    app.pdfPrompt =
      function(callback) {
        var confirmed = bootbox.confirm("Save your work as a PDF [OK] or return to the demonstration [Cancel]?",
          function(confirmed) {
            if (confirmed === true) {
              $("#container").trigger('docReady');
            } else {
              app.layer.scaleX(1.0);
              app.layer.scaleY(1.0);
              app.recOpacity(app.layer, 0);
              app.layer.y(app.prevLayerY);
              app.layer.draw();
              app.staticLayer.show();
              app.focusLayer.show();
              app.tempLayer.show();
              app.staticLayer.batchDraw();
              app.focusLayer.batchDraw();
              app.tempLayer.batchDraw();
            }
          });
      };

    app.showDocumentLayout = {
      onComplete: function() {
        app.staticLayer.hide();
        app.focusLayer.hide();

        app.recOpacity(app.layer, 1, "drop_area");

        app.layer.scaleX(0.7);
        app.layer.scaleY(0.7);
        app.layer.setY(0);
        app.layer.setX(20);
        app.layer.show();
        app.layer.draw();
      }
    };

    app.hideDocumentLayout = function() {
      app.staticLayer.show();
      app.focusLayer.show();

      app.recOpacity(app.layer, 0, "drop_area");

      app.layer.scaleX(1);
      app.layer.scaleY(1);

      app.staticLayer.batchDraw();
      app.focusLayer.batchDraw();
      app.tempLayer.batchDraw();

      app.layer.batchDraw();
      app.layer.show();
    };

    var previousShape;
    app.stage.on("dragmove", function(evt) {

      var pos = app.stage.getPointerPosition();
      var shape = app.focusLayer.getIntersection(pos);
      app.tempLayer.moveToTop();
      if (previousShape && shape) {
        if (previousShape !== shape) {
          // leave from old targer
          previousShape.fire('dragleave', {
            type: 'dragleave',
            target: previousShape,
            evt: evt.evt
          }, true);

          // enter new targer
          shape.fire('dragenter', {
            type: 'dragenter',
            target: shape,
            evt: evt.evt
          }, true);
          previousShape = shape;
        } else {
          previousShape.fire('dragover', {
            type: 'dragover',
            target: previousShape,
            evt: evt.evt
          }, true);
        }
      } else if (!previousShape && shape) {
        previousShape = shape;
        shape.fire('dragenter', {
          type: 'dragenter',
          target: shape,
          evt: evt.evt
        }, true);
      } else if (previousShape && !shape) {
        previousShape.fire('dragleave', {
          type: 'dragleave',
          target: previousShape,
          evt: evt.evt
        }, true);
        previousShape = undefined;
      }


    });
    app.stage.on("dragend", function(e) {
      var pos = app.stage.getPointerPosition();
      var shape = app.focusLayer.getIntersection(pos);

      if (shape) {
        if (shape.opacity() === 1.0) {
          if (shape.name().indexOf('drop_area') !== -1) {

            previousShape.fire('drop', {
              type: 'drop',
              target: previousShape,
              evt: e.evt
            }, true);

            previousShape = undefined;

            e.target.moveTo(shape.group);
            e.target.x(0 - circleDiameter / 2); //- 1 / (pos.x / shape.group.x));
            e.target.y(0 - circleDiameter / 2); //- 1 / (pos.y / dr.y));

            e.target.moveToTop();

            return;
          }
        }
      }

      app.ui.returnToContainer(e.target, iconHomeScale);
    });

    app.stage.on("dragenter", function(e) {
      if (e.target.opacity < interactableThresholdOpacity) return false;

    });

    app.stage.on("dragleave", function(e) {
      if (e.target.opacity < interactableThresholdOpacity) return false;

      if (e.target.name().indexOf('drop_area') !== -1) {
        e.target.fill(drop_areaFillColor);

      }
    });



    app.stage.on("dragover", function(e) {
      if (e.target.opacity() < interactableThresholdOpacity) return false;

      if (DEBUG) {
        console.log("Over " + e.target.name());
      }

      if (app.sizeChangeOnDrop && !app.currentDragObject.sizeChanged) {
        //  app.currentDragObject.setScaleX(app.currentDragObject.scaleX() * e.target.focusMultiplier);
        //  app.currentDragObject.setScaleY(app.currentDragObject.scaleY() * e.target.focusMultiplier);
        app.currentDragObject.setWidth(e.target.placementOffset.w * e.target.focusMultiplier);
        app.currentDragObject.setHeight(e.target.placementOffset.h * e.target.focusMultiplier);
      //  width: drop_area.placementOffset.w,
      //  height: drop_area.placementOffset.h,
      //  x: drop_area.placementOffset.x,
      //  y: drop_area.placementOffset.y,
        app.currentDragObject.sizeChanged = true;

      }
      //app.currentDragObject.setX(e.target.placementOffset.x);
      //app.currentDragObject.setY(e.target.placementOffset.y);
      //app.currentDragObject.setX(app.stage.getPointerPosition().x - ((app.currentDragObject.width() / 2) * e.target.focusMultiplier));
      //app.currentDragObject.setY(app.stage.getPointerPosition().y - ((app.currentDragObject.height() / 2) * e.target.focusMultiplier));

      if (e.target.name().indexOf('drop_area') !== -1) {

        e.target.fill(drop_areaHoverColor);
        //  text.text('dragover ' + e.target.name());

        app.focusLayer.draw();
      }
    });

    app.stage.on("drop", function(e) {

      var pointerPos = app.stage.getPointerPosition();
      var sizeRevert = false;

      if (e.target.opacity() !== 1.0) {
        app.ui.returnToContainer(app.currentDragObject, iconHomeScale);
        return;
      }

      if (e.target.name().indexOf('drop_area') !== -1) {
        if (!app.ui.placeInDropArea(e.target, pointerPos)) {
          app.ui.returnToContainer(app.currentDragObject, iconHomeScale);
        }
      }
    });

    app.stage.on("touchstart mouseover", function(e) {
      //console.log("fired mo ");
      if (e.target.opacity() < interactableThresholdOpacity) {
        return false;
      }
      var pos = app.stage.getPointerPosition();
      var shape = app.staticLayer.getIntersection(pos);

      if (shape && typeof shape.getUIComponentType === 'function') {
        if (shape.getUIComponentType() === 'button') {
          if (e.type === "touchstart") {
            shape.fill(buttonClickColor);
          } else {
            shape.fill(buttonHoverColor);
          }

          app.staticLayer.draw();
        }
      }
    });

    app.stage.on("mouseout", function(e) {
      if (e.target.opacity() < interactableThresholdOpacity) {
        return false;
      }
      var shape = e.target;

      if (shape && typeof shape.getUIComponentType === 'function') {
        if (shape.getUIComponentType() === 'button') {
          if (DEBUG) {
            console.log("mouseout");
          }
          shape.fill(buttonFillColor);
          app.staticLayer.draw();
        }
      }
    });
    app.stage.on("mousedown", function(e) {
      if (e.target.opacity() < interactableThresholdOpacity) {
        return false;
      }
      var shape = e.target;

      if (shape && typeof shape.getUIComponentType === 'function') {
        if (shape.getUIComponentType() === 'button') {
          shape.fill(buttonClickColor);
        }
      }
    });

    // jquery events
    $(app.stage).on('touchDropArea', function(e, args) {
      $("#labelme").show();
      $("#undo, #reset, #pdf").addClass("disabled").prop("disabled", true);

      $("#labelme input").on('change', function(e) {
        if (!args.drop_area.label) {
          args.drop_area.label = $(args.drop_area.label).clone(args.drop_area.next.label);
          app.safeLabel = args.drop_area.label;
        }

        var str = args.drop_area.label.text();
        var type = $(e.target).prop('id');
        args.drop_area.label.text(str + "\n(" + type + ")");


        $("#undo, #reset, #pdf").removeClass("disabled").prop("disabled", false);
        $("#labelme").hide().find('input').prop('checked', false).off('change');
          args.callback();
      });
    });

    DOMLabelWidth = $('#labelme').width();
    DOMLabelHeight = $('#labelme').height();
  }
};

app.prevLayerY = 0;

/* convert output to PDF and download */
$(document).on('docReady', "#container", function() {
  app.layer.moveToTop();
  app.staticLayer.hide();
  app.focusLayer.hide();
  app.tempLayer.hide();

  for (var i = 0; i < app.sequences.length; i++) {
    var drop_area = app.stage.find("#drop_area_" + i)[0];
        if(drop_area) {
            drop_area.opacity(1.0);
            drop_area.group.opacity(1.0);
            drop_area.group.moveToTop();
        }
  }

  app.prevLayerY = app.layer.y();
  app.layer.y(5);
  app.layer.x(-100);
  app.layer.scaleX(0.75);
  app.layer.scaleY(0.65);
  app.layer.draw();

  var canv = app.layer.getCanvas();
  var imgData1 = canv.toDataURL('image/png');

/*  app.layer.x(0);
  app.layer.y(-330);
  app.layer.scaleX(0.8);
  app.layer.scaleY(0.7);
  app.layer.draw();

  //app.layer.scaleX(1.2);
//  app.layer.scaleY(1.2);
//  app.layer.draw();
  var imgData2 = canv.toDataURL('image/png');*/

  var pdf = new jsPDF('p', 'px', 'a4', false);

  pdf.addImage(imgData1, 'PNG', 0, 0, 645, 600);
  //pdf.addPage('a4', 'landscape');
//  pdf.addImage(imgData2, 'PNG', 0, 0, 645, 600);
  pdf.save('meiosis.pdf');
  app.layer.hide();
  bootbox.alert("Thank you. The PDF is in your downloads folder. Click OK to complete another exercise.", function() {
    document.location.reload();
  });
}).on("click", "#tour", function(e) {
  e.preventDefault();
  $("#homeMenu").hide();
  $("body h1").addClass("h1_w_controls");
  $("#container, .meiosis-intro, .control-row").show();
  app.run();

  //function show_buttons() { $(".btn, .control-row").show(); }

  introJs.introJs().start();

}).on("click", "#begin", function(e) {
  e.preventDefault();
  $("#homeMenu").hide();
  $("body h1").addClass("h1_w_controls");
  $("#container, .control-row").show();

  app.run();
  if (DEBUG) {
    //app.ui.playEndSequence(app.showDocumentLayout);
  }
}).on("click", "#undo", function(e) {
  app.ui.undo();
}).on("click", "#reset", function(e) {
  bootbox.confirm("This will reload the application. Are you sure?", function(c) {
    if (c) {
      window.location.reload();
    }
  });
}).on("click", "#pdf", function(e) {
  if ($("#pdf").hasClass("active")) {
    $("#download-pdf").hide();
    app.hideDocumentLayout();
    $("#pdf").removeClass("active"); //.prop("disabled", false);
    $("#undo, #reset").removeClass("disabled").prop("disabled", false);
  } else {
    app.ui.playEndSequence(app.showDocumentLayout);
    $("#download-pdf").show();
    $(e.target).addClass("active");
    $("#undo, #reset").addClass("disabled").prop("disabled", true);
  }
}).on("click", "#download-pdf", function(e) {
  $("#download-pdf").hide();
  $("#container").trigger("docReady");
});
})();
