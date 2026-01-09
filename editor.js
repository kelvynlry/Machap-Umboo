const canvas = new fabric.Canvas("editorCanvas", {
  width: 1080,
  height: 1440,
  preserveObjectStacking: true,
  selection: true
});

let frameObject = null;

// 上传照片
document.getElementById("uploadImage").addEventListener("change", function (e) {
  let reader = new FileReader();

  reader.onload = function (event) {
    fabric.Image.fromURL(event.target.result, function (img) {

      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        hasControls: true
      });

      img.scaleToWidth(900);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  reader.readAsDataURL(e.target.files[0]);
});

// 点击表情添加
document.querySelectorAll(".emoji-option").forEach(img => {
  img.addEventListener("click", function () {

    fabric.Image.fromURL(img.src, function (emoji) {
      emoji.set({
        left: 300,
        top: 300,
        originX: "center",
        originY: "center",
        scaleX: 0.4,
        scaleY: 0.4,
        hasRotatingPoint: true
      });

      canvas.add(emoji);
      canvas.setActiveObject(emoji);
      canvas.renderAll();
    });

  });
});

// 切换边框
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
        selectable: false
      });

      frame.scaleToWidth(canvas.width);
      frameObject = frame;
      canvas.add(frame);
      frame.bringToFront();
      canvas.renderAll();
    });
  }
};

// 删除选中的对象
document.getElementById("deleteSelected").onclick = function () {
  let obj = canvas.getActiveObject();
  if (obj && obj !== frameObject) canvas.remove(obj);
};

// 下载高清（无需缩放 — 因为本来就是1080x1440）
document.getElementById("download").onclick = function () {
  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1
  });

  const link = document.createElement("a");
  link.download = "final_1080x1440.png";
  link.href = dataURL;
  link.click();
};
