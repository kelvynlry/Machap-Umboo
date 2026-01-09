// fabric canvas (scaled preview 1/3 size, output still 1080x1440)
const canvas = new fabric.Canvas("editorCanvas", {
  width: 360,
  height: 480,
  preserveObjectStacking: true
});

const OUTPUT_WIDTH = 1080;
const OUTPUT_HEIGHT = 1440;
let frameObject = null;

// Enable gestures (touch)
canvas.on('touch:gesture', function (e) {
  let obj = canvas.getActiveObject();
  if (!obj) return;

  if (e.e.touches && e.e.touches.length === 2) {
    let scale = e.self.scale;
    let rotation = e.self.rotation;

    obj.scale(scale).rotate(rotation);
    canvas.requestRenderAll();
  }
});

// 1. Upload image
document.getElementById("uploadImage").addEventListener("change", function (e) {
  let reader = new FileReader();
  reader.onload = function (event) {
    fabric.Image.fromURL(event.target.result, function (img) {

      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        selectable: true,
        hasRotatingPoint: true
      });

      img.scaleToWidth(canvas.width * 0.9);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };
  reader.readAsDataURL(e.target.files[0]);
});

// 2. Add emoji
document.getElementById("addEmoji").onclick = function () {
  fabric.Image.fromURL("emoji1.png", function (emoji) {
    emoji.set({
      left: 150,
      top: 150,
      scaleX: 0.3,
      scaleY: 0.3,
      selectable: true,
      hasRotatingPoint: true
    });
    canvas.add(emoji);
    canvas.setActiveObject(emoji);
    canvas.renderAll();
  });
};

// 3. Toggle frame
document.getElementById("toggleFrame").onclick = function () {
  if (frameObject) {
    canvas.remove(frameObject);
    frameObject = null;
  } else {
    fabric.Image.fromURL("frame1.png", function (frame) {
      frame.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false
      });

      frame.scaleToWidth(canvas.width);
      frameObject = frame;
      canvas.add(frame);
      frame.moveTo(999); // keep frame on top
      canvas.renderAll();
    });
  }
};

// 4. Delete selected object
document.getElementById("deleteSelected").onclick = function () {
  let obj = canvas.getActiveObject();
  if (obj && obj !== frameObject) {
    canvas.remove(obj);
  }
};

// 5. Download exact 1080x1440 output
document.getElementById("download").onclick = function () {
  // create temp canvas for HD output
  let exportCanvas = new fabric.Canvas(null, {
    width: OUTPUT_WIDTH,
    height: OUTPUT_HEIGHT
  });

  // clone all objects with scale factor 1080/360 = 3
  let scaleFactor = OUTPUT_WIDTH / canvas.width;

  canvas.getObjects().forEach(obj => {
    obj.clone(clone => {
      clone.scale(clone.scaleX * scaleFactor);
      clone.set({
        left: obj.left * scaleFactor,
        top: obj.top * scaleFactor,
        angle: obj.angle
      });
      exportCanvas.add(clone);
      exportCanvas.renderAll();
    });
  });

  // export PNG
  let dataURL = exportCanvas.toDataURL({ format: "png", quality: 1 });
  let link = document.createElement("a");
  link.download = "output_1080x1440.png";
  link.href = dataURL;
  link.click();
};
