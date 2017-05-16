/**
 * @Author: ps158
 * @Date:   2017-02-02T10:13:46+11:00
 * @Last modified by:   ps158
 * @Last modified time: 2017-05-03T16:42:07+10:00
 */
require('konva');
require('bootstrap');

var DEBUG = true;

var app = {
  run: function() {

    app.sizeChangeOnDrop = 3;

    var width = 800;
    var height = 610;
    var circleDiameter = 145;
    var circleSpace = 155;

    var borderColor = '#896724';
    var circleFillColor = '#eed'; //'rgb(201,200,184)'; //'rgba(254,255,173,0.8)';
    var circleDropColor = '#eed'; //'#DAD7C5';
    var circleHoverColor = '#EEE'; //'rgb(117,128,194)';
    var circleStrokeColor = 'black';

    var circleFocusMultiplier = 2.65;

    var buttonLabelColor = '#F7DFAE';
    var buttonFillColor = '#467D7D';
    var buttonHoverColor = '#699494';
    var buttonClickColor = '#FFD874';

    var interactableThresholdOpacity = 0.8;
    var unfocusedEggOpacity = 0;
    var topOffset = -100;

    var iconWidth = 140;
    var iconHeight = 140;
    var iconHomeScale = 0.9;
    var iconsPerRow = 4;

    var containerFill = '#FFF1D6'; //'rgb(201,200,184)';
    var containerStroke = 'black';
    var containerHeight = 160;
    var containerX = -21;
    var containerY = 280;
    var containerWidth = 615;

    var precursorX = 33;
    var precursorY = 13;

    //- (iconWidth * 0.25);
    var rightLabelOffset = -(circleSpace / 2);
    var leftLabelOffset = -(circleSpace);
    var scrollDistance = 10;
    var urlBase = ''; //'/test/meiosis/'

    var focusedEgg = null;
    var focusPositionX = 410;
    var focusPositionY = 225;

    var textEggLabels = [{
        x: -67,
        y: 75,
        text: 'Precursor Germ cells'
      },
      {
        x: circleSpace + rightLabelOffset,
        y: 0,
        text: 'Prophase I'
      },
      {
        x: circleSpace + rightLabelOffset,
        y: 0,
        text: 'Metaphase I'
      },
      {
        x: circleSpace + rightLabelOffset,
        y: 0,
        text: 'Anaphase I'
      },
      {
        x: circleSpace + rightLabelOffset,
        y: 0,
        text: 'Prophase II\n Centriole 1'
      },
      {
        x: circleSpace + rightLabelOffset,
        y: 0,
        text: 'Prophase II\n Centriole 2'
      },
      {
        x: circleSpace + rightLabelOffset,
        y: 0,
        text: 'Metaphase II\n Centriole 1'
      },
      {
        x: circleSpace + rightLabelOffset,
        y: 0,
        text: 'Metaphase II\n Centriole 2'
      },
      {
        x: circleSpace + rightLabelOffset,
        y: 0,
        text: 'Anaphase II\n Centriole 1'
      },
      {
        x: circleSpace + rightLabelOffset,
        y: 0,
        text: 'Anaphase II\n Centriole 2'
      },
      {
        x: circleSpace - 200,
        y: 80,
        text: 'Final Gamete I'
      },
      {
        x: circleSpace - 210,
        y: 80,
          text: 'Final Gamete II'
      },
      {
        x: circleSpace - 210,
        y: 80,
        text: 'Final Gamete III'
      },
      {
        x: circleSpace - 210,
        y: 80,
        text: 'Final Gamete IV'
      }
    ];

    var imageSources = {
      precursor: 'img/Precursor-Germ-Cell-80.png',
      sequences: {
        PROPHASE_I: {
          icons: ['img/Prophase 1/PROPHASE 1 - A version-80.png',
            'img/Prophase 1/Prophase-1 -B version-80.png',
            'img/Prophase 1/Ptophase-1 -C- version-80.png'
          ],
          answerIds: ['c', 'x1', 'x2']
        },
        METAPHASE_I: {
          // links to previous answers
          links: {
            c: ['c1', 'c2', 'x1'],
            x1: ['x2', 'x3', 'x4'],
            x2: ['x5', 'x6', 'x7']
          },
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
          answerIds: ['c1', 'c2', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7'],
        },
        ANAPHASE_I: {
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
        //  next_circle_bg_color: '#fff',
          icons: ['img/Anaphase 11/Ai-Anaphase-1-80.png',
            'img/Anaphase 1/Aii-Anaphase-1-80.png',
            'img/Anaphase 1/Aiii-Anaphase-1-80.png',
            'img/Anaphase 1/Bi-Anaphase-1-80.png',
            'img/Anaphase 1/Bii-Anaphase-1-80.png',
            'img/Anaphase 1/Biii-Anaphase-1-80.png',
            'img/Anaphase 1/Ci-Anaphase-1-80.png',
            'img/Anaphase 1/Cii-Anaphase-1-80.png',
            'img/Anaphase 1/Ciii-Anaphase-1-80.png'
          ],
          answerIds: ['c1', 'c2', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7'],
        },

        PROPHASE_II_A: {
          links: {
            c1: ['c1', 'c2', 'x1','x2'],
            c2: ['c3', 'c4', 'x3','x4'],
            x1: ['x1', 'x2', 'x5', 'x6'],
            x2: ['x1', 'x2', 'x3', 'x4'],
            x3: ['x5', 'x6', 'x12', 'x13'],
            x4: ['x5', 'x6', 'x7', 'x8','x9'],
            x5: ['x5', 'x6', 'x7', 'x8','x9'],
            x6: ['x10', 'x11', 'x12','x13','x14'],
            x7: ['x10', 'x11', 'x12','x13','x14'],
          },
          icons: ['img/Prophase 11/Ai Prophase 11 - 1-80.png',
            'img/Prophase 11/Ai Prophase 11 - 2-80.png',
            'img/Prophase 11/Aii Prophase 11 - 1-80.png',
            'img/Prophase 11/Aii Prophase 11 - 2-80.png',
            'img/Prophase 11/Aiii Prophase 11 - 1-80.png',
            'img/Prophase 11/Aiii Prophase 11 - 2-80.png',
            'img/Prophase 11/Bi Prophase 11 - 1-80.png',
            'img/Prophase 11/Bi Prophase 11 - 2-80.png',
            'img/Prophase 11/Bii Prophase 11 - 1-80.png',
            'img/Prophase 11/Bii Prophase 11 - 2-80.png',
            'img/Prophase 11/Biii Prophase 11 - 1-80.png',
            'img/Prophase 11/Biii Prophase 11 - 2-80.png',
            'img/Prophase 11/Ci Prophase 11 - 1-80.png',
            'img/Prophase 11/Ci Prophase 11 - 2-80.png',
            'img/Prophase 11/Cii Prophase 11 - 1-80.png',
            'img/Prophase 11/Cii Prophase 11 - 2-80.png',
            'img/Prophase 11/Ciii Prophase 11 - 1-80.png',
            'img/Prophase 11/Ciii Prophase 11 - 2-80.png',
          ],
          answerIds: ['c1','c2','c3','c4', 'x1', 'x2', 'x3', 'x4', 'x5',
          'x6','x7','x8','x9','x10','x11','x12','x13','x14']
        },
        PROPHASE_II_B: {
          links: {
            c1: ['c1', 'c2', 'x1','x2'],
            c2: ['c3', 'c4', 'x3','x4'],
            x1: ['x1', 'x2', 'x5', 'x6'],
            x2: ['x1', 'x2', 'x3', 'x4'],
            x3: ['x5', 'x6', 'x12', 'x13'],
            x4: ['x5', 'x6', 'x7', 'x8','x9'],
            x5: ['x5', 'x6', 'x7', 'x8','x9'],
            x6: ['x10', 'x11', 'x12','x13','x14'],
            x7: ['x10', 'x11', 'x12','x13','x14'],
          },
          icons: ['img/Prophase 11/Ai Prophase 11 - 1-80.png',
            'img/Prophase 11/Ai Prophase 11 - 2-80.png',
            'img/Prophase 11/Aii Prophase 11 - 1-80.png',
            'img/Prophase 11/Aii Prophase 11 - 2-80.png',
            'img/Prophase 11/Aiii Prophase 11 - 1-80.png',
            'img/Prophase 11/Aiii Prophase 11 - 2-80.png',
            'img/Prophase 11/Bi Prophase 11 - 1-80.png',
            'img/Prophase 11/Bi Prophase 11 - 2-80.png',
            'img/Prophase 11/Bii Prophase 11 - 1-80.png',
            'img/Prophase 11/Bii Prophase 11 - 2-80.png',
            'img/Prophase 11/Biii Prophase 11 - 1-80.png',
            'img/Prophase 11/Biii Prophase 11 - 2-80.png',
            'img/Prophase 11/Ci Prophase 11 - 1-80.png',
            'img/Prophase 11/Ci Prophase 11 - 2-80.png',
            'img/Prophase 11/Cii Prophase 11 - 1-80.png',
            'img/Prophase 11/Cii Prophase 11 - 2-80.png',
            'img/Prophase 11/Ciii Prophase 11 - 1-80.png',
            'img/Prophase 11/Ciii Prophase 11 - 2-80.png',
          ],
          answerIds: ['c1','c2','c3','c4', 'x1', 'x2', 'x3', 'x4', 'x5',
          'x6','x7','x8','x9','x10','x11','x12','x13','x14']
        },
        METAPHASE_II_A: {
          links: {
            c1: ['c1', 'c2', 'x1','x2'],
            c2: ['c3', 'c4', 'x3','x4'],
            x1: ['x1', 'x2', 'x5', 'x6'],
            x2: ['x1', 'x2', 'x3', 'x4'],
            x3: ['x5', 'x6', 'x12', 'x13'],
            x4: ['x5', 'x6', 'x7', 'x8','x9'],
            x5: ['x5', 'x6', 'x7', 'x8','x9'],
            x6: ['x10', 'x11', 'x12','x13','x14'],
            x7: ['x10', 'x11', 'x12','x13','x14'],
            x8: ['x10', 'x11', 'x12','x13','x14'],
            x9: ['x10', 'x11', 'x12','x13','x14'],
            x10: ['x10', 'x11', 'x12','x13','x14'],
            x11: ['x10', 'x11', 'x12','x13','x14'],
            x12: ['x10', 'x11', 'x12','x13','x14'],
            x13: ['x10', 'x11', 'x12','x13','x14'],
            x14: ['x10', 'x11', 'x12','x13','x14']
          },
          icons: ['img/Metaphase 11/Ai Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Ai Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Aii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Aii Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Aiii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Aiii Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Bi Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Bi Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Bii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Bii Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Biii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Biii Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Ci Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Ci Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Cii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Cii Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Ciii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Ciii Metaphase 11 - 2-80.png',
          ],
          answerIds: ['c1','c2','c3','c4', 'x1', 'x2', 'x3', 'x4', 'x5',
          'x6','x7','x8','x9','x10','x11','x12','x13','x14']
        },
        METAPHASE_II_B: {
          links: {
            c1: ['c1', 'c2', 'x1','x2'],
            c2: ['c3', 'c4', 'x3','x4'],
            x1: ['x1', 'x2', 'x5', 'x6'],
            x2: ['x1', 'x2', 'x3', 'x4'],
            x3: ['x5', 'x6', 'x12', 'x13'],
            x4: ['x5', 'x6', 'x7', 'x8','x9'],
            x5: ['x5', 'x6', 'x7', 'x8','x9'],
            x6: ['x10', 'x11', 'x12','x13','x14'],
            x7: ['x10', 'x11', 'x12','x13','x14'],
            x8: ['x10', 'x11', 'x12','x13','x14'],
            x9: ['x10', 'x11', 'x12','x13','x14'],
            x10: ['x10', 'x11', 'x12','x13','x14'],
            x11: ['x10', 'x11', 'x12','x13','x14'],
            x12: ['x10', 'x11', 'x12','x13','x14'],
            x13: ['x10', 'x11', 'x12','x13','x14'],
            x14: ['x10', 'x11', 'x12','x13','x14']
          },
          icons: ['img/Metaphase 11/Ai Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Ai Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Aii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Aii Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Aiii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Aiii Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Bi Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Bi Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Bii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Bii Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Biii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Biii Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Ci Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Ci Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Cii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Cii Metaphase 11 - 2-80.png',
            'img/Metaphase 11/Ciii Metaphase 11 - 1-80.png',
            'img/Metaphase 11/Ciii Metaphase 11 - 2-80.png',
          ],
          answerIds: ['c1','c2','c3','c4', 'x1', 'x2', 'x3', 'x4', 'x5',
          'x6','x7','x8','x9','x10','x11','x12','x13','x14']
        },
        ANAPHASE_II_A: {
          links: {
            c1: ['c1', 'c2', 'x1','x2'],
            c2: ['c3', 'c4', 'x3','x4'],
            x1: ['x1', 'x2', 'x5', 'x6'],
            x2: ['x1', 'x2', 'x3', 'x4'],
            x3: ['x5', 'x6', 'x12', 'x13'],
            x4: ['x5', 'x6', 'x7', 'x8','x9'],
            x5: ['x5', 'x6', 'x7', 'x8','x9'],
            x6: ['x10', 'x11', 'x12','x13','x14'],
            x7: ['x10', 'x11', 'x12','x13','x14'],
            x8: ['x10', 'x11', 'x12','x13','x14'],
            x9: ['x10', 'x11', 'x12','x13','x14'],
            x10: ['x10', 'x11', 'x12','x13','x14'],
            x11: ['x10', 'x11', 'x12','x13','x14'],
            x12: ['x10', 'x11', 'x12','x13','x14'],
            x13: ['x10', 'x11', 'x12','x13','x14'],
            x14: ['x10', 'x11', 'x12','x13','x14']
          },
          icons: ['img/Anaphase 11/Ai Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Ai Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Aii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Aii Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Aiii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Aiii Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Bi Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Bi Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Bii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Bii Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Biii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Biii Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Ci Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Ci Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Cii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Cii Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Ciii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Ciii Anaphase 11 - 2-80.png',
          ],
          answerIds: ['c1','c2','c3','c4', 'x1', 'x2', 'x3', 'x4', 'x5',
          'x6','x7','x8','x9','x10','x11','x12','x13','x14']
        },
        ANAPHASE_II_B: {
          links: {
            c1: ['c1', 'c2', 'x1','x2'],
            c2: ['c3', 'c4', 'x3','x4'],
            x1: ['x1', 'x2', 'x5', 'x6'],
            x2: ['x1', 'x2', 'x3', 'x4'],
            x3: ['x5', 'x6', 'x12', 'x13'],
            x4: ['x5', 'x6', 'x7', 'x8','x9'],
            x5: ['x5', 'x6', 'x7', 'x8','x9'],
            x6: ['x10', 'x11', 'x12','x13','x14'],
            x7: ['x10', 'x11', 'x12','x13','x14'],
            x8: ['x10', 'x11', 'x12','x13','x14'],
            x9: ['x10', 'x11', 'x12','x13','x14'],
            x10: ['x10', 'x11', 'x12','x13','x14'],
            x11: ['x10', 'x11', 'x12','x13','x14'],
            x12: ['x10', 'x11', 'x12','x13','x14'],
            x13: ['x10', 'x11', 'x12','x13','x14'],
            x14: ['x10', 'x11', 'x12','x13','x14']
          },
          icons: ['img/Anaphase 11/Ai Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Ai Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Aii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Aii Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Aiii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Aiii Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Bi Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Bi Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Bii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Bii Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Biii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Biii Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Ci Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Ci Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Cii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Cii Anaphase 11 - 2-80.png',
            'img/Anaphase 11/Ciii Anaphase 11 - 1-80.png',
            'img/Anaphase 11/Ciii Anaphase 11 - 2-80.png',
          ],
          answerIds: ['c1','c2','c3','c4', 'x1', 'x2', 'x3', 'x4', 'x5',
          'x6','x7','x8','x9','x10','x11','x12','x13','x14']
        },
        FINAL_GAMETE_I: {
          links: {
            c1: ['c1', 'c2', 'x1','x2'],
            c2: ['c3', 'c4', 'x3','x4'],
            x1: ['x1', 'x2', 'x5', 'x6'],
            x2: ['x1', 'x2', 'x3', 'x4'],
            x3: ['x5', 'x6', 'x12', 'x13'],
            x4: ['x5', 'x6', 'x7', 'x8','x9'],
            x5: ['x5', 'x6', 'x7', 'x8','x9'],
            x6: ['x10', 'x11', 'x12','x13','x14'],
            x7: ['x10', 'x11', 'x12','x13','x14'],
            x8: ['x10', 'x11', 'x12','x13','x14'],
            x9: ['x10', 'x11', 'x12','x13','x14'],
            x10: ['x10', 'x11', 'x12','x13','x14'],
            x11: ['x10', 'x11', 'x12','x13','x14'],
            x12: ['x10', 'x11', 'x12','x13','x14'],
            x13: ['x10', 'x11', 'x12','x13','x14'],
            x14: ['x10', 'x11', 'x12','x13','x14']
          },
          icons: ['img/Final Gametes/Ai Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ai Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ai Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ai Gamete 11 - 2b-80.png',
            'img/Final Gametes/Aii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Aii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Aii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Aii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Bi Gamete 11 - 1a-80.png',
            'img/Final Gametes/Bi Gamete 11 - 1b-80.png',
            'img/Final Gametes/Bi Gamete 11 - 2a-80.png',
            'img/Final Gametes/Bi Gamete 11 - 2b-80.png',
            'img/Final Gametes/Bii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Bii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Bii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Bii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Biii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Biii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Biii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Biii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Ci Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ci Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ci Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ci Gamete 11 - 2b-80.png',
            'img/Final Gametes/Cii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Cii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Cii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Cii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 2b-80.png'
          ],
          answerIds: ['c1','c2','c3','c4', 'x1', 'x2', 'x3', 'x4', 'x5',
          'x6','x7','x8','x9','x10','x11','x12','x13','x14']
        },
        FINAL_GAMETE_II: {
          links: {
            c1: ['c1', 'c2', 'x1','x2'],
            c2: ['c3', 'c4', 'x3','x4'],
            x1: ['x1', 'x2', 'x5', 'x6'],
            x2: ['x1', 'x2', 'x3', 'x4'],
            x3: ['x5', 'x6', 'x12', 'x13'],
            x4: ['x5', 'x6', 'x7', 'x8','x9'],
            x5: ['x5', 'x6', 'x7', 'x8','x9'],
            x6: ['x10', 'x11', 'x12','x13','x14'],
            x7: ['x10', 'x11', 'x12','x13','x14'],
            x8: ['x10', 'x11', 'x12','x13','x14'],
            x9: ['x10', 'x11', 'x12','x13','x14'],
            x10: ['x10', 'x11', 'x12','x13','x14'],
            x11: ['x10', 'x11', 'x12','x13','x14'],
            x12: ['x10', 'x11', 'x12','x13','x14'],
            x13: ['x10', 'x11', 'x12','x13','x14'],
            x14: ['x10', 'x11', 'x12','x13','x14']
          },
          icons: ['img/Final Gametes/Ai Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ai Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ai Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ai Gamete 11 - 2b-80.png',
            'img/Final Gametes/Aii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Aii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Aii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Aii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Bi Gamete 11 - 1a-80.png',
            'img/Final Gametes/Bi Gamete 11 - 1b-80.png',
            'img/Final Gametes/Bi Gamete 11 - 2a-80.png',
            'img/Final Gametes/Bi Gamete 11 - 2b-80.png',
            'img/Final Gametes/Bii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Bii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Bii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Bii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Biii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Biii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Biii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Biii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Ci Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ci Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ci Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ci Gamete 11 - 2b-80.png',
            'img/Final Gametes/Cii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Cii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Cii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Cii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 2b-80.png'
          ],
          answerIds: ['c1','c2','c3','c4', 'x1', 'x2', 'x3', 'x4', 'x5',
          'x6','x7','x8','x9','x10','x11','x12','x13','x14']
        },
        FINAL_GAMETE_III: {
          links: {
            c1: ['c1', 'c2', 'x1','x2'],
            c2: ['c3', 'c4', 'x3','x4'],
            x1: ['x1', 'x2', 'x5', 'x6'],
            x2: ['x1', 'x2', 'x3', 'x4'],
            x3: ['x5', 'x6', 'x12', 'x13'],
            x4: ['x5', 'x6', 'x7', 'x8','x9'],
            x5: ['x5', 'x6', 'x7', 'x8','x9'],
            x6: ['x10', 'x11', 'x12','x13','x14'],
            x7: ['x10', 'x11', 'x12','x13','x14'],
            x8: ['x10', 'x11', 'x12','x13','x14'],
            x9: ['x10', 'x11', 'x12','x13','x14'],
            x10: ['x10', 'x11', 'x12','x13','x14'],
            x11: ['x10', 'x11', 'x12','x13','x14'],
            x12: ['x10', 'x11', 'x12','x13','x14'],
            x13: ['x10', 'x11', 'x12','x13','x14'],
            x14: ['x10', 'x11', 'x12','x13','x14']
          },
          icons: ['img/Final Gametes/Ai Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ai Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ai Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ai Gamete 11 - 2b-80.png',
            'img/Final Gametes/Aii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Aii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Aii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Aii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Bi Gamete 11 - 1a-80.png',
            'img/Final Gametes/Bi Gamete 11 - 1b-80.png',
            'img/Final Gametes/Bi Gamete 11 - 2a-80.png',
            'img/Final Gametes/Bi Gamete 11 - 2b-80.png',
            'img/Final Gametes/Bii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Bii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Bii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Bii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Biii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Biii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Biii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Biii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Ci Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ci Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ci Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ci Gamete 11 - 2b-80.png',
            'img/Final Gametes/Cii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Cii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Cii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Cii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 2b-80.png'
          ],
          answerIds: ['c1','c2','c3','c4', 'x1', 'x2', 'x3', 'x4', 'x5',
          'x6','x7','x8','x9','x10','x11','x12','x13','x14']
        },
        FINAL_GAMETE_IV: {
          links: {
            c1: ['c1', 'c2', 'x1','x2'],
            c2: ['c3', 'c4', 'x3','x4'],
            x1: ['x1', 'x2', 'x5', 'x6'],
            x2: ['x1', 'x2', 'x3', 'x4'],
            x3: ['x5', 'x6', 'x12', 'x13'],
            x4: ['x5', 'x6', 'x7', 'x8','x9'],
            x5: ['x5', 'x6', 'x7', 'x8','x9'],
            x6: ['x10', 'x11', 'x12','x13','x14'],
            x7: ['x10', 'x11', 'x12','x13','x14'],
            x8: ['x10', 'x11', 'x12','x13','x14'],
            x9: ['x10', 'x11', 'x12','x13','x14'],
            x10: ['x10', 'x11', 'x12','x13','x14'],
            x11: ['x10', 'x11', 'x12','x13','x14'],
            x12: ['x10', 'x11', 'x12','x13','x14'],
            x13: ['x10', 'x11', 'x12','x13','x14'],
            x14: ['x10', 'x11', 'x12','x13','x14']
          },
          icons: ['img/Final Gametes/Ai Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ai Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ai Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ai Gamete 11 - 2b-80.png',
            'img/Final Gametes/Aii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Aii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Aii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Aii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Aiii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Bi Gamete 11 - 1a-80.png',
            'img/Final Gametes/Bi Gamete 11 - 1b-80.png',
            'img/Final Gametes/Bi Gamete 11 - 2a-80.png',
            'img/Final Gametes/Bi Gamete 11 - 2b-80.png',
            'img/Final Gametes/Bii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Bii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Bii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Bii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Biii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Biii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Biii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Biii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Ci Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ci Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ci Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ci Gamete 11 - 2b-80.png',
            'img/Final Gametes/Cii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Cii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Cii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Cii Gamete 11 - 2b-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 1a-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 1b-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 2a-80.png',
            'img/Final Gametes/Ciii Gamete 11 - 2b-80.png'
          ],
          answerIds: ['c1','c2','c3','c4', 'x1', 'x2', 'x3', 'x4', 'x5',
          'x6','x7','x8','x9','x10','x11','x12','x13','x14']
        }
      }
    };

    app.sequences = [null,
      'PROPHASE_I',
      'METAPHASE_I',
      'ANAPHASE_I',
      'PROPHASE_II_A',
      'PROPHASE_II_B',
      'METAPHASE_II_A',
      'METAPHASE_II_B',
      'ANAPHASE_II_A',
      'ANAPHASE_II_B',
      'FINAL_GAMETE_I',
      'FINAL_GAMETE_II',
      'FINAL_GAMETE_III',
      'FINAL_GAMETE_IV'
    ];

    var loadCount = [];

    app.stage = new Konva.Stage({
      container: '#container',
      width: width,
      height: height
    });

    var stageCenter = app.stage.width() / 2;

    app.layer = new Konva.Layer({
      name: 'eggLayer'
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
    app.recOpacity = function(o, v, exempt) {
      if (!exempt) exempt = null;
      o.children.forEach(function(n) {
        n.opacity(v);
        if (n.children && typeof n !== exempt) {
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
        var j, x, i;
        for (i = o.icons.length; i; i--) {
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

      setEggLabel: function(i, egg, x, y) {
        if (!textEggLabels[i]) return false;

        var text = new Konva.Text({
          fill: '#1F325C',
          x: x + textEggLabels[i].x,
          y: y + textEggLabels[i].y,
          fontSize: '14'
        });

        text.startingPosition = {
          x: x + textEggLabels[i].x,
          y: y + textEggLabels[i].y
        };
        text.text(textEggLabels[i].text);

        egg.group.add(text);
        egg.label = text;

        app.ui.debugRect(x + textEggLabels[i].x, y + textEggLabels[i].y, text.getWidth(), text.getHeight());
      },

      undo: function() {
        var egg = undoHistory[undoHistory.length - 1];

        if (egg) {
          app.ui.clearIconMenu();

          if (egg.chromos.length > 0) {
            var ret = egg.chromos.pop();
            app.ui.returnToContainer(ret, iconHomeScale);
          }

          if (egg.chromos.length === 0) {
            undoHistory.pop();

            app.ui.resetMenuOptions(egg);

            egg.fill(circleFillColor);
            egg.opacity(1.0);

            var str = egg.label.text();

            var dipi = str.indexOf("\n(hap)");
            var hapi = str.indexOf("\n(dip)");

            var pos = dipi > 0 ? dipi : hapi;

            if (pos > 0) {
              str = str.substr(0, pos);
              egg.label.setText(str);
            }

            if (egg.prev && !egg.prev.isPrecursor) {
              egg.prev.opacity(1.0);
              egg.prev.canswerId = null;
              app.ui.toggleAllIconsDraggable(egg.prev, true);
            }
            if (egg.next) {
              egg.next.opacity(unfocusedEggOpacity);
              egg.next.canswerId = null;
              app.ui.toggleAllIconsDraggable(egg.next, false);
            }

            app.layer.batchDraw();

            app.ui.focus(egg.next, {
              focusOut: true,
              onComplete: function() {
                app.ui.focus(egg, {
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

      toggleAllIconsDraggable: function(egg, draggable) {
        if (!egg || !egg.chromos) return false;

        if (typeof draggable !== 'boolean') {
          draggable = true;
        }

        egg.chromos.forEach(function(chrom) {
          chrom.draggable(draggable);
        });
      },

      placeInEgg: function(egg, pointerPos) {
        //var w = app.currentDragObject.getWidth();
        //var h = app.currentDragObject.getHeight();

        egg.canswerId = app.currentDragObject.answerId;

        //  app.currentDragObject.setWidth(w);
        //    app.currentDragObject.setHeight(h);

        var prevEgg = egg.prev;

        if (prevEgg) {
          if (prevEgg.chromos.length > 0 || prevEgg.isPrecursor) {
            if (egg.next && egg.next === app.currentDragObject.inEgg) {
              return false;
            }

            if (!prevEgg.isPrecursor) {
            //  prevEgg.opacity(unfocusedEggOpacity);

              app.ui.toggleAllIconsDraggable(prevEgg, false);
            }

            if (app.ui.allIconsPlaced()) {
              app.ui.toggleAllIconsDraggable(egg, true);
            }

            egg.chromos.push(app.currentDragObject);
            app.currentDragObject.inEgg = egg;

            if (!egg.isPrecursor) undoHistory.push(egg);

            app.currentDragObject.setPlaced(true);

          }
        }

        if (egg) {
          $(egg).trigger('beforeEggTween', {
            callback: function() {
              app.focusLayer.hide();

              egg.moveToBottom();

              if(DEBUG) {
                console.log("Changing circle fill color to: "+app.currentDragObject.next_circle_bg_color);
                console.log(app.currentDragObject);
              }
              circleFillColor = app.currentDragObject.next_circle_bg_color;

              app.currentDragObject.sizeChanged = false;
              app.chromTween = new Konva.Tween({
                node: app.currentDragObject,
                duration: 0.1,
                opacity: 1,
                width: 47,
                height: 47,
                x: -70,
                y: -70,
                onFinish: function() {
                  app.layer.draw();
                  app.tempLayer.draw();
                  app.staticLayer.draw();
                }
              });

              app.chromTween.play();
              app.ui.focus(egg, {
                focusOut: true,
                onComplete: function() {
                  app.focusLayer.show();

                  if (egg.next) {

                    app.ui.updateIcons(egg.next);
                    app.ui.focus(egg.next, {
                      focusOut: false,
                      onComplete: function() {

                      }
                    });
                    egg.next.moveToTop();
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

      scrollPage: function(egg) {
        if (!egg) return false;

        var layerCentre = (app.layer.y() / 2);
        var y = layerCentre < egg.group.y() ? -egg.group.y() / 20 : egg.group.y() / 20;
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

        if (icon.getWidth() !== iconWidth) {
          icon.setWidth(iconWidth * scaled);
        }

        if (icon.getHeight() !== iconHeight) {
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

        if (icon.inEgg) {
          icon.inEgg.chromos.remove(app.currentDragObject);
          app.ui.checkForEmptyEgg(icon.inEgg);
        }

        icon.setPlaced(false);

        if (icon.inEgg && icon.inEgg.prev) {
          app.ui.updateIcons(icon.inEgg.prev);
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

        delete(icon.inEgg); // = null;
      },

      checkForEmptyEgg: function(egg) {
        if (egg.chromos.length === 0) {
          egg.fill(circleFillColor);
          if (egg.next) {
            egg.next.opacity(unfocusedEggOpacity);
          }
          if (egg.prev) {
            egg.prev.opacity(1.0);

            egg.prev.chromos.forEach(function(chrom) {
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
      hideUnusedIcons: function(inx, seqStr, egg) {

        var answerId = imageSources.sequences[seqStr].answerIds[inx];
        app.ui.icon.konvaWrappers[seqStr][inx].answerId = answerId;

        if (DEBUG) {
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

        if (DEBUG) {
          console.log("Current icon node");
          console.log(_node.name());
          console.log("Visible?: ");
          console.log(_node.visible());
        }
        if (eggAnswer) {
          try {
            if (imageSources.sequences[seqStr].links[eggAnswer].indexOf(answerId) === -1) {

              if (DEBUG) {
                if (egg.prev) {
                  console.log("Prev: " + egg.prev.canswerId);
                  console.log(" in > " + seqStr);
                  console.log(imageSources.sequences[seqStr].links[eggAnswer].indexOf(answerId));
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
              console.log("Answer was: " + eggAnswer);
            }
          }
        }
      },
      playEndSequence: function(o) {

        o.onComplete();
      },
      updateIcons: function(egg) {
        var sequence;

        console.log("Home Scale on call: "+iconHomeScale);

        if (typeof egg === 'number') {
          sequence = egg;
        } else {
          sequence = egg.sequence;
        }
        var seqStr = app.sequences[sequence];
        loadCount[seqStr] = 0;

        if (!imageSources.sequences[seqStr]) return false;

        if(typeof imageSources.sequences[seqStr].next_circle_bg_color === 'undefined') {
            imageSources.sequences[seqStr]["next_circle_bg_color"] = circleFillColor;
            if(DEBUG) {
                console.log("SET color: "+imageSources.sequences[seqStr].next_circle_bg_color);
            }
        }

        if (!app.ui.icon.konvaWrappers) {
          app.ui.icon.init();
        }

        app.ui.clearIconMenu(iconMenu.group);

        if (app.ui.icon.konvaWrappers[seqStr].length === 0) {

          var xchromPos = 45;
          var ychromPos = 178;
         //iconVSpacing;
          var hSpace = 40; //cctXPos - iconHSpacing * 0.075;

          app.ui.icon.images = app.ui.icon.images || {};
          app.ui.icon.images[seqStr] = app.ui.icon.images[seqStr] || [];

          app.shuffle(imageSources.sequences[seqStr]);
          var eggAnswer = egg.prev ? egg.prev.canswerId : egg.canswerId;

          if(DEBUG) {
              console.log("Icon array length: "+imageSources.sequences[seqStr].icons.length);
          }

          var ac = 0;
          imageSources.sequences[seqStr].icons.forEach(
            function(src, inx) {

              var answerId = imageSources.sequences[seqStr].answerIds[inx];
              try {
              if (!eggAnswer || imageSources.sequences[seqStr].links[eggAnswer].indexOf(answerId) !== -1) {
                if (DEBUG) {
                  console.log("Loading icon image: " + src);
                }
                ac = ac + 1;
                app.ui.icon.images[seqStr][inx] = new Image();

                app.ui.icon.konvaWrappers[seqStr][inx] = new Konva.Image({
                  x: xchromPos,
                  y: ychromPos,
                  image: app.ui.icon.images[seqStr][inx],
                  width: iconWidth,
                  height: iconHeight,
                  name: 'chromosome_' + inx,
                  draggable: true,
                  fill: 'transparent'
                });

                app.ui.icon.konvaWrappers[seqStr][inx].sequence = sequence;
                app.ui.icon.konvaWrappers[seqStr][inx].answerId = answerId;

                app.ui.icon.konvaWrappers[seqStr][inx].next_circle_bg_color = imageSources.sequences[seqStr].next_circle_bg_color;

                app.ui.icon.konvaWrappers[seqStr][inx].setHomePos({
                  x: xchromPos,
                  y: ychromPos
                });
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

                var vSpace = (iconHeight / 2) + 3;
                //iconMenu.group.draw();
                xchromPos += iconWidth;
                console.log("Index count: "+inx);
                if(ac % iconsPerRow === 0) {
                  ychromPos += vSpace;
                  xchromPos = 45;
                }


                //  xchromPos = ((inx + 1) % iconsPerRow) === 0 ?  xchromPos : xchromPos + hSpace;
                //if(egg) {
                //      app.ui.hideUnusedIcons(inx, seqStr, egg);
                //  }
              }
            } catch(error) {
                console.err(error);
                bootbox.alert(error);
            }
            }
          );

          console.log("AC count: "+ac);
          if(ac > iconsPerRow) {
              iconHomeScale = 0.5;
          } else {
              iconHomeScale = 1;
          }
          console.log("Konva length: "+app.ui.icon.konvaWrappers[seqStr].length);

          app.ui.icon.konvaWrappers[seqStr].forEach(function(o, i) {
              //  o.sizeChangeOnDrop = iconHomeScale + 1;
                //o.hSpacing = i > 0 ? hSpace * iconHomeScale : 0;
                console.log("HSpacing = "+o.hSpacing+" ["+i+"]");
                o.setWidth(iconWidth * iconHomeScale);
                o.setHeight(iconHeight * iconHomeScale);
                console.log("Modulus = "+ (i % iconsPerRow));
                if(iconHomeScale < 1 && i > 1 && i % (iconsPerRow + 1) !== 0) {
                    o.setX(o.x() + hSpace / 2);
                }
          });

          console.log("Home Scale: "+iconHomeScale);

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
            //  if(egg.next) {
            app.ui.hideUnusedIcons(inx, seqStr, egg);
            //  }
          });
        }

        if (focusedEgg.group.startingPosition && sequence == 1) {
          app.ui.focus(focusedEgg);
        }
      },
      focusing: false,
      focus: function(thisEgg, params) {
        if (!thisEgg.group.startingPosition) return false;
        if (app.ui.focusing) return false;

        if (!params) {
          params = {
            focusOut: false,
            onComplete: null,
            reverseScroll: false
          };
        }

        if (!thisEgg) return false;

        var x;
        var y;

        x = params.focusOut ? thisEgg.group.startingPosition.x : focusPositionX;
        y = params.focusOut ? thisEgg.group.startingPosition.y : focusPositionY;

        if (params.focusOut) {
          thisEgg.group.moveTo(app.layer);
        } else {
          thisEgg.group.moveTo(app.focusLayer);
        }

        //if(app.currentDragObject)
        //console.log("Current parent before focus tween "+app.currentDragObject.parent.attrs.name);

        app.focusLayer.moveToTop();
        app.recOpacity(thisEgg.group, 1);
        thisEgg.group.moveToTop();

        app.ui.scrollPage(params.reverseScroll ? thisEgg.prev : thisEgg.next);

        app.safeLabel = null;

        if (thisEgg.label) {
          app.safeLabel = thisEgg.label;
        } else if (thisEgg.next.label) {
          app.safeLabel = thisEgg.next.label;
          app.safeLabel.moveTo(thisEgg.next.group);
        }

        app.eggTween = new Konva.Tween({
          node: thisEgg,
          duration: 0.1,
          fill: circleFillColor,
          opacity: params.focusOut ? unfocusedEggOpacity : 1,
          onFinish: function() {
            if (app.safeLabel) {
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
          if (app.eggTween) {

            app.eggTween.play();

          }

          app.ui.focusing = false;

        };
        if (app.safeLabel) {
          var s = app.safeLabel.text();
          var c = (s.match(/\n/g) || []).length;

          var n = 67 - (12 * c);

          app.textTween = new Konva.Tween({
            node: app.safeLabel,
            duration: 0.1,
            x: params.focusOut ? app.safeLabel.startingPosition.x : -140.5, //text.x() - 100,
            y: params.focusOut ? app.safeLabel.startingPosition.y : n,
            onFinish: function() {
              app.playEggTween();
            }
          });
        }

        app.groupTween = app.groupTween || [];

        if (typeof app.groupTween.destroy === 'function') {
          app.groupTween.destroy();
        }

        app.groupTween = new Konva.Tween({
          node: thisEgg.group,
          duration: 0.5,
          x: x,
          y: y,
          easing: Konva.Easings.BackEaseIn,
          opacity: params.focusOut ? unfocusedEggOpacity : 1,
          scaleX: params.focusOut ? 1 : circleFocusMultiplier,
          scaleY: params.focusOut ? 1 : circleFocusMultiplier,
          onFinish: function() {
            thisEgg.cache();
            app.textTween.play();

            if (params.onComplete) {
              params.onComplete();
            }

            app.ui.focusing = true;
          }
        });

        app.thread = setTimeout(function() {
          iconMenu.setListening(false);
          app.groupTween.play();

        }, 50);

        focusedEgg = thisEgg;

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

          if (DEBUG) {
            console.log("added");
            console.log(egg.name());
          }
          this.group.startingPosition = {
            x: params.x,
            y: params.y
          };
          if (this.isPrecursor) {
            app.staticLayer.add(this.group);
          } else {
            app.layer.add(this.group);
          }
          this.group.add(egg);

          $(this).on("beforeEggTween", function(e, o) {
            $(app.stage).trigger('touchEgg', {
              egg: e.target,
              callback: o.callback
            });
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
      if (el !== null) {
        loadCount[el] = 0;
      }
    });

    //staticLayer.clearBeforeDraw(false);
    //staticLayer.draw();

    var text = new Konva.Text({
      fill: 'black'
    });

    //layer.add(text);

    // setup chromosome container
    var iconMenu = new Konva.Rect({
      x: cctXPos + 50,
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

    app.staticLayer.add(iconMenu.group);
    iconMenu.setListening(false);

    var setPrecursor = function(pX, pY, i) {
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
        app.staticLayer.add(precursor);
      };
    };
    // setup egg interface
    var yoff = 35;
    var opacity;
    var eggMap = [];
    var precursorImg = new Image();
    var precursor;
    var previousEgg;

    for (var i = 0; i < 14; i++) {
      var x;
      var y;

      if (i === 0) {
        x = 109;
        y = 93;

        var pX = x; // create local instance
        var pY = y;

        setPrecursor(pX, pY, i);

      } else if (i < 4) {
        x = problemPosFormula - (circleDiameter / 2);
        y = circleDiameter + yoff + topOffset;
        yoff += circleSpace;
      }
     /* even no'd eggs on left (change order of === 0,1
     to change starting on an even or odd)*/
      else if (i < 10 && i % 2 === 0) {
        x = problemPosFormula - circleDiameter * 1.9;
        y = circleDiameter + yoff + topOffset;
      } else if (i < 10 && i % 2 === 1) {     // odd no'd eggs on right
        x = problemPosFormula + circleDiameter * 0.9;
        yoff += circleSpace;
      } else if (i == 10) {
        x = problemPosFormula - circleDiameter * 2.8;
        y = circleDiameter + yoff + topOffset;
      } else if (i == 11) {
        x = problemPosFormula - circleDiameter * 1.1;
      } else if (i == 12) {
        x = problemPosFormula + circleDiameter * 0.1;
      } else if (i == 13) {
        x = problemPosFormula + circleDiameter * 1.8;
      }

      if(DEBUG) {
          console.log("Setup index: "+i);
          console.log("X: "+x+" Y:"+y);
      }

      opacity = i > 1 ? unfocusedEggOpacity : 1.0;

      var egg = new Konva.Circle({
        radius: (circleDiameter / 2) * circleFocusMultiplier,
        stroke: circleStrokeColor,
        scaleX: 1 / circleFocusMultiplier,
        scaleY: 1 / circleFocusMultiplier,
        name: 'egg_' + i,
        id: 'egg_' + i,
        opacity: opacity,
        fill: circleFillColor,
      });

      egg.isPrecursor = i < 1;
      egg.sequence = i == 4 || i == 5 ? 5 : i;
      egg.scrollPageOnDrop = 'down';

      egg.initEgg({
        next: null,
        prev: previousEgg,
        chromos: [],
        x: x,
        y: y
      });
      app.ui.setEggLabel(i, egg, 0, 0);

      if (previousEgg && egg) {
        previousEgg.next = egg;
      }

      previousEgg = egg;

      egg.group.moveToBottom();

      egg.cache();

      if (i === 1) {
        focusedEgg = egg;
      }

      egg = null;
    }

    precursorImg.src = urlBase + imageSources.precursor;

    app.ui.updateIcons(1);
    //app.ui.focus(focusedEgg);

    app.stage.add(app.staticLayer, app.layer, app.focusLayer, app.tempLayer);


    app.layer.setListening(false);

    // hide all eggs
    app.layer.children.forEach(
      function(n) {
        n.opacity(0);
      });

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

        app.recOpacity(app.layer, 1);
        app.layer.scaleX(0.55);
        app.layer.scaleY(0.55);
        app.layer.setY(0);
        app.layer.setX(20);
        app.layer.show();
        app.layer.draw();
      }
    };

    app.hideDocumentLayout = function() {
      app.staticLayer.show();
      app.focusLayer.show();

      app.recOpacity(app.layer, 0);
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
          if (shape instanceof Konva.Circle || (shape && shape.inEgg && shape.name() !== 'container')) {

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

      if (e.target instanceof Konva.Circle) {
        e.target.fill(circleFillColor);
        //    text.text('dragleave ' + e.target.name());
        //layer.draw();
      }
    });



    app.stage.on("dragover", function(e) {
      if (e.target.opacity() < interactableThresholdOpacity) return false;

      if (DEBUG) {
        console.log("Over " + e.target.name());
      }

      if (app.sizeChangeOnDrop && !app.currentDragObject.sizeChanged) {
        app.currentDragObject.setScaleX(app.currentDragObject.scaleX() * app.sizeChangeOnDrop);
        app.currentDragObject.setScaleY(app.currentDragObject.scaleY() * app.sizeChangeOnDrop);

        app.currentDragObject.sizeChanged = true;

      }

      app.currentDragObject.setX(app.stage.getPointerPosition().x - ((app.currentDragObject.width() / 2) * app.sizeChangeOnDrop));
      app.currentDragObject.setY(app.stage.getPointerPosition().y - ((app.currentDragObject.height() / 2) * app.sizeChangeOnDrop));

      if (e.target instanceof Konva.Circle) {

        e.target.fill(circleHoverColor);
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

      if (e.target instanceof Konva.Circle) {
        if (!app.ui.placeInEgg(e.target, pointerPos)) {
          app.ui.returnToContainer(app.currentDragObject, iconHomeScale);
        }
      }
    });

    app.stage.on("touchstart mouseover", function(e) {
      //  console.log("fired mo ");
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
    $(app.stage).on('touchEgg', function(e, args) {
      $("#labelme").show();
      $("#undo, #reset, #pdf").addClass("disabled").prop("disabled", true);

      $("#labelme input").on('change', function(e) {
        if (!args.egg.label) {
          args.egg.label = $(args.egg.label).clone(args.egg.next.label);
          app.safeLabel = args.egg.label;
        }

        var str = args.egg.label.text();
        var type = $(e.target).prop('id');
        args.egg.label.text(str + "\n(" + type + ")");
        args.callback();

        $("#undo, #reset, #pdf").removeClass("disabled").prop("disabled", false);
        $("#labelme").hide().find('input').prop('checked', false).off('change');
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

  for (var i = 0; i < 14; i++) {
    var egg = app.stage.find("#egg_" + i)[0];
    egg.opacity(1.0);
    egg.group.opacity(1.0);
    egg.group.moveToTop();
  }

  app.prevLayerY = app.layer.y();
  app.layer.y(5);
  app.layer.x(-100);
  app.layer.scaleX(0.75);
  app.layer.scaleY(0.65);
  app.layer.draw();

  var canv = app.layer.getCanvas();
  var imgData1 = canv.toDataURL('image/png');

  app.layer.x(0);
  app.layer.y(-330);
  app.layer.scaleX(0.8);
  app.layer.scaleY(0.7);
  app.layer.draw();

  //app.layer.scaleX(1.2);
//  app.layer.scaleY(1.2);
//  app.layer.draw();
  var imgData2 = canv.toDataURL('image/png');

  var pdf = new jsPDF('p', 'px', 'a4', false);

  pdf.addImage(imgData1, 'PNG', 0, 0, 645, 600);
  pdf.addPage('a4', 'landscape');
  pdf.addImage(imgData2, 'PNG', 0, 0, 645, 600);
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
    //  app.ui.playEndSequence(app.showDocumentLayout);
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
