import html2Canvas from 'html2canvas';

import JsPDF from 'jspdf';
// title:下载文件的名称  htmlId:包裹的标签的id
const htmlToPdf = (title: string, htmlId: string) => {
  const element = document.querySelector(htmlId) as HTMLElement;
  window.pageYOffset = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  setTimeout(() => {
    // // 以下注释的是增加导出的pdf水印 ！！！！！！！！！！！！！
    // const value = '我是水印'
    // //创建一个画布
    // let can = document.createElement('canvas')
    // //设置画布的长宽
    // can.width = 400
    // can.height = 500

    // let cans = can.getContext('2d') as any
    // //旋转角度
    // cans.rotate((-15 * Math.PI) / 180)
    // cans.font = '18px Vedana'
    // //设置填充绘画的颜色、渐变或者模式
    // cans.fillStyle = 'rgba(200, 200, 200, 0.40)'
    // //设置文本内容的当前对齐方式
    // cans.textAlign = 'left'
    // //设置在绘制文本时使用的当前文本基线
    // cans.textBaseline = 'Middle'
    // //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
    // cans.fillText(value, can.width / 8, can.height / 2)
    // let div = document.createElement('div')
    // div.style.pointerEvents = 'none'
    // div.style.top = '20px'
    // div.style.left = '-20px'
    // div.style.position = 'fixed'
    // div.style.zIndex = '100000'
    // div.style.width = element.scrollHeight + 'px'
    // div.style.height = element.scrollHeight + 'px'
    // div.style.background =
    //   'url(' + can.toDataURL('image/png') + ') left top repeat'
    // element.appendChild(div) // 到页面中

    html2Canvas(element, {
      allowTaint: true,
      useCORS: true,
      scale: 2, // 提升画面质量，但是会增加文件大小
      height: element.scrollHeight, // 需要注意，element的 高度 宽度一定要在这里定义一下，不然会存在只下载了当前你能看到的页面   避雷避雷！！！
      windowHeight: element.scrollHeight,
    }).then(function (canvas) {
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      // console.log('contentWidth', contentWidth)
      // console.log('contentHeight', contentHeight)
      // 一页pdf显示html页面生成的canvas高度;
      const pageHeight = (contentWidth * 841.89) / 592.28;
      // 未生成pdf的html页面高度
      let leftHeight = contentHeight;

      // console.log('pageHeight', pageHeight)
      // console.log('leftHeight', leftHeight)
      // 页面偏移
      let position = 0;
      // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高  //40是左右页边距
      const imgWidth = 595.28 - 40;
      const imgHeight = (592.28 / contentWidth) * contentHeight;

      const pageData = canvas.toDataURL('image/jpeg', 1.0);

      const pdf = new JsPDF('p', 'pt', 'a4');

      // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        // console.log('没超过1页')
        pdf.addImage(pageData, 'JPEG', 20, 20, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          // console.log('超过1页')
          pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          // 避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save(`${title}.pdf`);
    });
  }, 1000);
};

export default htmlToPdf;
