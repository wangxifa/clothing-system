import { Drawer, Form, Input, InputNumber, Button } from 'antd';

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 16 },
};

const style = { width: 400 };
const NumStyle = { width: 200 }

const ClothDrawer = (props) => {
    const [form] = Form.useForm();
    const { onClose, visible, title, data, changeDataSource } = props;

    // 取消
    const handleClose = () => {
        onClose();
        form.resetFields()
    }

    // 确认
    const handleEnter = () => {
        // const Fields = form.getFieldsValue();

        form.validateFields().then(values => {
            changeDataSource(values);
            handleClose()
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <Drawer
            title={title}
            placement="right"
            width={600}
            onClose={handleClose}
            visible={visible}
            destroyOnClose
            footer={
                <div
                    style={{
                    textAlign: 'right',
                    }}
                >
                    <Button onClick={handleClose} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button onClick={handleEnter} type="primary">
                        确认
                    </Button>
                </div>
            }
        >
        <Form
            layout="horizontal"
            form={form}
            {...layout}
        >
            {
                title === '新增' && (
                    <>
                        <Form.Item label="款号" name="款号" rules={[{ required: true, message: '请输入' }]}>
                            <Input style={style} placeholder="请输入款号" />
                        </Form.Item>
                        <Form.Item label="颜色" name="颜色" rules={[{ required: true, message: '请输入' }]}>
                            <Input style={style} placeholder="请输入颜色" />
                        </Form.Item>
                    </>
                )
            }

            <Form.Item initialValue={0} label="S" name="S" rules={[{ required: true, message: '请输入' }]}>
                <InputNumber min={0} max={title === '出库' && data.S} style={NumStyle} placeholder="请输入" />
            </Form.Item>
            <Form.Item initialValue={0} label="M" name="M" rules={[{ required: true, message: '请输入' }]}>
                <InputNumber min={0} max={title === '出库' && data.M} style={NumStyle} placeholder="请输入" />
            </Form.Item>
            <Form.Item initialValue={0} label="L" name="L" rules={[{ required: true, message: '请输入' }]}>
                <InputNumber min={0} max={title === '出库' && data.L} style={NumStyle} placeholder="请输入" />
            </Form.Item>
            <Form.Item initialValue={0} label="XL" name="XL" rules={[{ required: true, message: '请输入' }]}>
                <InputNumber min={0} max={title === '出库' && data.XL} style={NumStyle} placeholder="请输入" />
            </Form.Item>
            <Form.Item initialValue={0} label="2XL" name="2XL" rules={[{ required: true, message: '请输入' }]}>
                <InputNumber min={0} max={title === '出库' && data['2XL']} style={NumStyle} placeholder="请输入" />
            </Form.Item>
            <Form.Item initialValue={0} label="3XL" name="3XL" rules={[{ required: true, message: '请输入' }]}>
                <InputNumber min={0} max={title === '出库' && data['3XL']} style={NumStyle} placeholder="请输入" />
            </Form.Item>
            <Form.Item initialValue={0} label="4XL" name="4XL" rules={[{ required: true, message: '请输入' }]}>
                <InputNumber min={0} max={title === '出库' && data['4XL']} style={NumStyle} placeholder="请输入" />
            </Form.Item>
      </Form>
        </Drawer>
    );
}

export default ClothDrawer;