const sharp = require('sharp');
const fs = require('fs');



let legoColors = {
    1: {r: 0xff, g: 0xff, b: 0xff},
    5: {r: 0xD9, g: 0xBB, b: 0x7B},
    18: {r: 0xD6, g: 0x72, b: 0x40},
    21: {r: 0xff, g: 0x00, b: 0x00},
    23: {r: 0x00, g: 0x00, b: 0xff},
    24: {r: 0xFf, g: 0xff, b: 0x00},
    26: {r: 0x00, g: 0x00, b: 0x00},
    28: {r: 0x00, g: 0x99, b: 0x00},
    37: {r: 0x00, g: 0xcc, b: 0x00},
    38: {r: 0xA8, g: 0x3D, b: 0x15},
    102: {r: 0x47, g: 0x8C, b: 0xC6},
    106: {r: 0xff, g: 0x66, b: 0x00},
    107: {r:0x00, g: 0x8F, b:0x9B},
    119: {r: 0x95, g: 0xB9, b: 0x0B},
    124: {r: 0x99, g: 0x00, b: 0x66},
    135: {r: 0x5E, g: 0x74, b: 0x8C},
    138: {r: 0x8D, g: 0x74, b: 0x52},
    140: {r: 0x00, g: 0x25, b: 0x41},
    141: {r: 0x00, g: 0x33, b: 0x00},
    151: {r: 0x5F, g: 0x82, b: 0x65},
    154: {r: 0x80, g: 0x08, b: 0x1B},
    191: {r: 0xF4, g: 0x9B, b: 0x00},
    192: {r: 0x5B, g: 0x1C, b: 0x0C},
    194: {r: 0x9C, g: 0x92, b: 0x91},
    199: {r: 0x4C, g: 0x51, b: 0x56},
    208: {r: 0xE4, g: 0xE4, b: 0xDA},
    212: {r: 0x87, g: 0xC0, b: 0xEA},
    221: {r: 0xDE, g: 0x37, b: 0x8B},
    222: {r: 0xEE, g: 0x9D, b: 0xC3},
    226: {r: 0xFF, g: 0xFF, b: 0x99},
    268: {r: 0x2C, g: 0x15, b: 0x77},
    283: {r: 0xF5, g: 0xC1, b: 0x89},
    297: {r: 0xAA, g: 0x7F, b: 0x2E},
    308: {r: 0x30, g: 0x0F, b: 0x06},
    312: {r: 0xAA, g: 0x7D, b: 0x55},
    315: {r: 0x89, g: 0x87, b: 0x88},
    316: {r: 0x3E, g: 0x3C, b: 0x39},
    321: {r: 0x46, g: 0x9b, b: 0xc3},
    322: {r: 0x68, g: 0xc3, b: 0xe2},
    323: {r: 0xd3, g: 0xf2, b: 0xea},
    324: {r: 0xa0, g: 0x6e, b: 0xb9},
    325: {r: 0xcd, g: 0xa4, b: 0xde},
    329: {r: 0xf5, g: 0xf3, b: 0xd7},
    326: {r: 0xe2, g: 0xf9, b: 0x9a},
    330: {r: 0x77, g: 0x77, b: 0x4E}
}
let availableColors = [1, 106, 107, 119, 124, 135, 138, 140, 151, 154, 18, 191, 192
, 194, 199, 21, 221, 222, 226, 23, 24, 26, 268, 28, 297, 308, 312, 315, 316, 322, 323, 326, 330, 37, 38, 5];

//availableColors= [1,21,23,24,26]

function rgb2lab(rgb){
    let r = rgb.r / 255,
        g = rgb.g / 255,
        b = rgb.b / 255,
        x, y, z;
    let t1 = 0.04045;
    let t2 = 0.008856;
    if (r > t1){
        r = Math.pow((r + 0.055) / 1.055, 2.4);
    }
    else {
        r = r / 12.92;
    }
    if (g > t1){
        g = Math.pow((g + 0.055) / 1.055, 2.4);
    }
    else {
        g = g / 12.92;
    }   

    if (b > t1){
        b = Math.pow((b + 0.055) / 1.055, 2.4);
    }
    else {
        b = g / 12.92;
    }

    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  
    if (x > t2){
        x = Math.pow(x, 1/3);
    }
    else {
        x = (7.787 * x) + 16/116;
    }
  
    if (y > t2){
        y = Math.pow(y, 1/3) ;
    }
    else {
        y = (7.787 * y) + 16/116;
    }  

    if (z > t2){
        z =  Math.pow(z, 1/3);
    }
    else {
        z =  (7.787 * z) + 16/116;
    }

    return {l:(116 * y) - 16, a: 500 * (x - y), b:200 * (y - z)};
  }


  function deltaE(labA, labB){
    var dL = labA.l - labB.l;
    var dA = labA.a - labB.a;
    var dB = labA.b - labB.b;
    var cx = Math.sqrt(labA.a * labA.a + labA.b * labA.b);
    var cy = Math.sqrt(labB.a * labB.a + labB.b * labB.b);
    var dC = cx - cy;
    var dW = Math.min(dA * dA + dB * dB - dC * dC);
    var sc = 1.0 + 0.045 * cx;
    var sh = 1.0 + 0.015 * cy;
    var dX = dL / (1.0);
    var dY = dC / (sc);
    var dZ = Math.sqrt(dW) / (sh);
    var i = Math.min(dX * dX + dY * dY + dZ * dZ);
    return Math.sqrt(i);
  }


function getClosestColor(pixel) {
    var closest = 100000;
    var closestCode = 1;
    for (let index = 0; index < availableColors.length; index++) {
        let colorCode = availableColors[index];
        let color = legoColors[colorCode];
        let distance = deltaE(rgb2lab(pixel), rgb2lab(color))
        if (distance < closest){
            closest = distance;
            closestCode = colorCode;
        }
    }

    return closestCode;
}


let outputData = [];
async function processFile(inputFile) {
    let newWidth = 32;
    let newHeight = 32;
    try {
        await sharp(inputFile)
        .sharpen()
        
        .normalise()
        .resize({width:newWidth, heigh:newHeight, kernel:"cubic"})
        
        //.toFile("output_2.png")
        .raw()
        .toBuffer(function (err, outputBuffer, info) {
            //console.log(outputBuffer);
            console.log(info)
            for (let index = 0; index < info.width*info.height*info.channels; index+=info.channels) {
                let rgb = {r:outputBuffer[index],g:outputBuffer[index+1],b:outputBuffer[index+2]};
                let legoColor = legoColors[getClosestColor(rgb)];
                outputData.push(getClosestColor(rgb));
               // console.log(getClosestColor(rgb))

                outputBuffer[index] = legoColor.r;
                outputBuffer[index+1] = legoColor.g;
                outputBuffer[index+2] = legoColor.b;
                
            }
            console.log(info.width*info.height);
            
            let outputText = "";
            for (let w = 0; w < info.width; w++) {
                let row = []
                for (let h = 0; h < info.height; h++) {
                    row.push(outputData[w*info.width+h]);
                }
                outputText = outputText + row.join("\t") + "\n";
                
            }
            
            

             fs.writeFile("output.txt",outputText,err=>{
                if(err){
                    console.error(err)
                } else{

                }
            })




            new sharp(outputBuffer,{raw:{width:info.width, height:info.height, channels:info.channels}})           
            .png()
            .toFile("output.png");
        })
        

        
    } catch (error) {
      console.log(`An error occurred during processing: ${error}`);
    }
  }

  processFile("miis.jpg")
