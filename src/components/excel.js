import { useState, useRef } from 'react';
import { Alert, message, Table, Button, Space, Input } from 'antd';
import ClothDrawer from './clothDrawer';
// import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { getSum } from '../utils';
import example from '../assets/example.xlsx'
// import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import './styles.css';

const Excel = () => {
    const searchInputRef = useRef();
    const [dataSource, setDataSource] = useState(
      (sessionStorage.getItem("clothingData") && JSON.parse(sessionStorage.getItem("clothingData"))) || []
    );
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState("新增");
    const [obj, setObj] = useState(null);
    const [index, setIndex] = useState(0);
   
    // XLSX.utils.sheet_to_csv：生成CSV格式
    // XLSX.utils.sheet_to_txt：生成纯文本格式
    // XLSX.utils.sheet_to_html：生成HTML格式
    // XLSX.utils.sheet_to_json：输出JSON格式
    const readWorkbook = (workbook) =>
    {
      const sheetNames = workbook.SheetNames; // 工作表名称集合
      const worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
      const json = XLSX.utils.sheet_to_json(worksheet);
     
      const data = getSum(json);
      setDataSource(data)
    }

    const readWorkbookFromLocalFile = (file, callback) => {
      const fileReader = new FileReader();
      const { files } = file.target;
      fileReader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {type: 'binary'});
        if(callback) callback(workbook);
        readWorkbook(workbook);
        // 最终获取到并且格式化后的 json 数据
        message.success('上传成功！')
      };
      // 以二进制方式打开文件
      if (fileReader && files[0]) {
        fileReader.readAsBinaryString(files[0] || []);
      } else {
        message.error('未读取到文件！');
      }
    }

     const openDownloadDialog = (url, saveName) =>
      {
        if(typeof url == 'object' && url instanceof Blob)
        {
          url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if(window.MouseEvent) event = new MouseEvent('click');
        else
        {
          event = document.createEvent('MouseEvents');
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
      }

    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    const sheet2blob = (sheet, sheetName) => {
      sheetName = sheetName || 'sheet1';
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;
      // 生成excel的配置项
      var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
      };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!==s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
      return blob;
    }

    // 导出
    const openDownload = () => {
      const json = XLSX.utils.json_to_sheet(dataSource);
      openDownloadDialog(sheet2blob(json), '导出.xlsx');
    }

    // 新增
    const openDrawer = () => {
      setVisible(true);
      setTitle('新增')
    }

    // 修改
    const changeDataSource = (data) => {
      if (title === '新增') {
        const _arr = JSON.parse(JSON.stringify(dataSource));
        _arr.push(data);
        const _data = getSum(_arr);
        setDataSource(_data);
      } else if (title === '入库') {
        const _arr = JSON.parse(JSON.stringify(dataSource));
        const val = _arr[index]
        if (val) {
          val.S = val.S + data.S;
          val.M = val.M + data.M;
          val.L = val.L + data.L;
          val.XL = val.XL + data.XL;
          val['2XL'] = val['2XL'] + data['2XL'];
          val['3XL'] = val['3XL'] + data['3XL'];
          val['4XL'] = val['4XL'] + data['4XL'];
          // val['合计'] = val.S + val.M + val.L + val.XL + val['2XL'] + val['3XL'] + val['4XL'];
          // console.log(val);
        }
        
        const _data = getSum(_arr);
        setDataSource(_data);
      } else if (title === '出库') {
        const _arr = JSON.parse(JSON.stringify(dataSource));
        const val = _arr[index]
        if (val) {
          val.S = val.S - data.S;
          val.M = val.M - data.M;
          val.L = val.L - data.L;
          val.XL = val.XL - data.XL;
          val['2XL'] = val['2XL'] - data['2XL'];
          val['3XL'] = val['3XL'] - data['3XL'];
          val['4XL'] = val['4XL'] - data['4XL'];
          // val['合计'] = val.S + val.M + val.L + val.XL + val['2XL'] + val['3XL'] + val['4XL'];
        }
        const _data = getSum(_arr);
        setDataSource(_data);
      } 
    }

    // 入库
    const Warehousing = (value, index) => {
      setVisible(true);
      setTitle('入库');
      setObj(value);
      setIndex(index)
    }

    // 出库
    const Delivery = (value, index) => {
      setVisible(true);
      setTitle('出库');
      setObj(value);
      setIndex(index)
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      // setSearchText(selectedKeys[0])
    };
  
    const handleReset = clearFilters => {
      clearFilters();
    };

    const getColumnSearchProps = dataIndex => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInputRef}
            placeholder={`搜索 ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 90 }}
            >
              搜索
            </Button>
            <Button onClick={() => handleReset(clearFilters)} style={{ width: 90 }}>
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
          : '',
      onFilterDropdownVisibleChange: visible => {
        if (visible && searchInputRef.current) {
          setTimeout(() => searchInputRef.current.select(), 100);
        }
      },
    });
 
    const columns = [
      {
        title: '款号',
        dataIndex: '款号',
        key: '款号',
        width: 200,
        fixed: 'left',
        ...getColumnSearchProps('款号'),
      },
      {
        title: '颜色',
        dataIndex: '颜色',
        key: '颜色',
        width: 100,
        ...getColumnSearchProps('颜色'),
      },
      {
        title: 'S',
        dataIndex: 'S',
        key: 'S',
        sorter: {
          compare: (a, b) => a.S - b.S,
        },
      },
      {
        title: 'M',
        dataIndex: 'M',
        key: 'M',
        sorter: {
          compare: (a, b) => a.M - b.M,
        },
      },
      {
        title: 'L',
        dataIndex: 'L',
        key: 'L',
        sorter: {
          compare: (a, b) => a.L - b.L,
        },
      },
      {
        title: 'XL',
        dataIndex: 'XL',
        key: 'XL',
        sorter: {
          compare: (a, b) => a.XL - b.XL,
        },
      },
      {
        title: '2XL',
        dataIndex: '2XL',
        key: '2XL',
        sorter: {
          compare: (a, b) => a['2XL'] - b['2XL'],
        },
      },
      {
        title: '3XL',
        dataIndex: '3XL',
        key: '3XL',
        sorter: {
          compare: (a, b) => a['3XL'] - b['3XL'],
        },
      },
      {
        title: '4XL',
        dataIndex: '4XL',
        key: '4XL',
        sorter: {
          compare: (a, b) => a['4XL'] - b['4XL'],
        },
      },
      {
        title: '合计',
        dataIndex: '合计',
        key: '合计',
        sorter: {
          compare: (a, b) => a['4XL'] - b['4XL'],
        },
        // render: (text, row) => {
        //  return (
        //   <span>
        //     {row.S +row.M + row.XL + row.L +row['2XL'] + row['3XL'] + row['4XL'] }
        //   </span>
        //  )
        // }
      },
      {
        title: '操作',
        dataIndex: '出入库',
        key: '出入库',
        fixed: 'right',
        width: 200,
        render: (text, row, index) => {
          return (
            <>
              {
                row['款号'] !== '统计' && (
                <Space>
                  <Button onClick={() => Warehousing(row, index)} type="primary">入库</Button>
                  <Button onClick={() => Delivery(row, index)} type="primary">出库</Button>
                </Space>
                )
              }
            </>
          )
         }
      },
    ];

    return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Space>
              <input type='file' accept='.xlsx, .xls' onChange={(e) => readWorkbookFromLocalFile(e)}  />
            </Space>

            <Space>
              <Button>
                <a href={example} download="导入模版示例.xlsx">下载模版</a>
              </Button>
              <Button type="primary" onClick={openDrawer}>新增</Button>
              <Button onClick={openDownload}>导出</Button>
            </Space>
          </div>
          <Alert message="使用前请先下载模版，按照模版格式填写数据，尺码必须填写数字" type="info" showIcon closable />
          {
            <div style={{ background: '#fff', padding: 12, marginTop: 24 }}>
              <Table 
                dataSource={dataSource} 
                columns={columns}
                pagination= {{
                  pageSize: 99999
                }}
                scroll={{ x: 1400 }}
                rowKey={record => record.__rowNum__ + record['款号'] + record['颜色']}
              />
            </div>
          }
          <ClothDrawer
            visible={visible}
            onClose={() => setVisible(false)}
            title={title}
            data={obj}
            index={index}
            changeDataSource={(data) => changeDataSource(data)}
          />
        </div>
    )
}

export default Excel;
