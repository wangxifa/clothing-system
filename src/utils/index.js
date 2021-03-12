const getSum = (value) => {
    let json = JSON.parse(JSON.stringify(value));
    let arr = [];
    let map = {};
    const result = json.some(item => {
      if (item['款号'] === '统计') {
        return true 
     } 
     return false
   })

    // 如果存在统计直接修改，否则添加
    if(result) {
      json = json.filter((item) => item['款号'] !== '统计');
    } 
    
    if(Array.isArray(json)) {
      let S = 0, M = 0, L = 0, XL = 0, XL2 = 0, XL3 = 0, XL4 = 0, total = 0;
      json.forEach((item, index) => {
        let sum = 0;
        for(let name in item) {
          if(name !== '合计' && name !== '款号' && name !== '颜色' && typeof item[name] === 'number') {
            sum +=  item[name];
          }
        }
        S +=  item['S'];
        M +=  item['M'];
        L +=  item['L'];
        XL +=  item['XL'];
        XL2 +=  item['2XL'];
        XL3 +=  item['3XL'];
        XL4 +=  item['4XL'];
        total += sum;
        item['合计'] = sum;
        arr.push(item);
      });
      
      map['款号'] = '统计';
      map['颜色'] = '-';
      map['S'] = S;
      map['M'] = M;
      map['L'] = L;
      map['XL'] = XL;
      map['2XL'] = XL2;
      map['3XL'] = XL3;
      map['4XL'] = XL4;
      map['合计'] = total;

     arr.unshift(map)
      
      const data = JSON.stringify(arr);
      sessionStorage.setItem("clothingData", data);
    }
    return arr;
}

export { getSum };
