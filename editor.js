// 初始化画布
const canvas = new fabric.Canvas("editorCanvas", {
  width: 1080,
  height: 1440,
  preserveObjectStacking: true,
});

// 禁用拖拉角点缩放旋转
fabric.Object.prototype.hasControls = false;
fabric.Object.prototype.cornerSize = 0;

let frameObject = null;

// 上传照片
document.getElementById("uploadImage").addEventListener("change", function (e) {
  const reader = new FileReader();

  reader.onload = function (event) {
    fabric.Image.fromURL(event.target.result, function (img) {
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
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
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        scaleX: 0.5,
        scaleY: 0.5,
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
        evented: false
      });

      frame.scaleToWidth(canvas.width);
      frameObject = frame;

      canvas.add(frame);
      frame.moveTo(canvas.getObjects().length - 1);
      canvas.renderAll();
    });
  }
};

// 删除选中对象
document.getElementById("deleteSelected").onclick = function () {
  const obj = canvas.getActiveObject();
  if (obj && obj !== frameObject) canvas.remove(obj);
};

// 缩放 + 旋转按钮操作
function modifySelected(type) {
  const obj = canvas.getActiveObject();
  if (!obj || obj === frameObject) return;

  if (type === "scaleUp") obj.scale(obj.scaleX * 1.1);
  if (type === "scaleDown") obj.scale(obj.scaleX * 0.9);
  if (type === "rotateLeft") obj.rotate(obj.angle - 10);
  if (type === "rotateRight") obj.rotate(obj.angle + 10);

  canvas.renderAll();
}

document.getElementById("scaleUp").onclick = () => modifySelected("scaleUp");
document.getElementById("scaleDown").onclick = () => modifySelected("scaleDown");
document.getElementById("rotateLeft").onclick = () => modifySelected("rotateLeft");
document.getElementById("rotateRight").onclick = () => modifySelected("rotateRight");

// 下载高清图
document.getElementById("download").onclick = function () {
  const link = document.createElement("a");
  link.download = "final_1080x1440.png";
  link.href = canvas.toDataURL({ format: "png", quality: 1 });
  link.click();
};
