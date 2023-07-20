export function toCSV(list: any[], title: string) {
  if (!list.length) {
    return;
  }
  const data = [
    Object.keys(list[0]).join(','),
    ...list.map((item) => {
      return Object.values(item).join(',');
    }),
  ];
  const csvString = data.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=UTF-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function formCSV(file: File, callback: any) {
  // 从上传的csv文件中读取并解析数据
  const reader = new FileReader();
  reader.readAsText(file, 'utf-8');
  console.log(reader);
  reader.onload = (e) => {
    const csvData = e.target?.result as string;
    const data = csvData.split('\n');
    const keys = data[0].split(',');
    const list = data.slice(1).map((item) => {
      const values = item.split(',');
      const obj: any = {};
      keys.forEach((key, index) => {
        if (values[index] != null && values[index] !== '') {
          obj[key] = values[index];
        }
      });
      return obj;
    });
    callback(list);
  };
}

// const list = data.slice(1).map((item) => {
//   const values = item.split(',');
//   return {
//     id: values[0],
//     username: values[1],
//     password: values[2],
//     name: values[3],
//     phone: values[4],
//     email: values[5],
//     wareId: values[6],
//     stationId: values[7],
//     createdTime: values[8],
//     updatedTime: values[9],
//   };
// });
// return list;

// export function toCSV(list: any[], title: string) {
//     const data = list.map((item) => {
//       return Object.values(item).join(',');
//     });
//     const csvString = data.join('\n');
//     const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
//     const link = document.getElementsByName(
//       'icon-download'
//     )[0] as HTMLAnchorElement;
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `${title}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   }
