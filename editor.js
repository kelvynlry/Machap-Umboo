// 初始化画布 1080x1440
const canvas = new fabric.Canvas("editorCanvas", {
  width: 1080,
  height: 1440,
  preserveObjectStacking: true
});

// --- 控制点放大，缩放旋转更好控制 ---
fabric.Object.prototype.cornerSize = 30;
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = "blue";
fabric.Object.prototype.cornerStrokeColor = "white";
fabric.Object.prototype.cornerStyle = "circle";
fabric.Object.prototype.centeredScaling = true;

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
        hasControls: true,
        selectable: true
      });

      img.scaleToWidth(900);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  reader.readAsDataURL(e.target.files[0]);
});

// 点击 emoji 添加
document.querySelectorAll(".emoji-option").forEach(icon => {
  icon.addEventListener("click", function () {

    fabric.Image.fromURL(icon.src, function (emoji) {
      emoji.set({
        left: 500,
        top: 500,
        originX: "center",
        originY: "center",
        scaleX: 0.4,
        scaleY: 0.4,
        hasRotatingPoint: true,
        selectable: true
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
        selectable: false,
        evented: false  // 🔥 不阻挡点击事件
      });

      frame.scaleToWidth(canvas.width);
      frameObject = frame;

      canvas.add(frame);
      frame.moveTo(canvas.getObjects().length - 1);
      canvas.renderAll();
    });
  }
};

// 删除对象
document.getElementById("deleteSelected").onclick = function () {
  const obj = canvas.getActiveObject();
  if (obj && obj !== frameObject) canvas.remove(obj);
};

// 下载 1080x1440 高清
document.getElementById("download").onclick = function () {
  const link = document.createElement("a");
  link.download = "final_1080x1440.png";
  link.href = canvas.toDataURL({ format: "png", quality: 1 });
  link.click();
};
