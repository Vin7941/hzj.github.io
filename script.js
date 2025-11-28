// 修改执行函数部分
async function executeRequest(mobileValue) {
    try {
        // 第一步：获取token
        const tokenResponse = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ step: 1 })
        });
        const tokenData = await tokenResponse.json();

        if (tokenData.code === 1) {
            // 第二步：提交订单
            const orderResponse = await fetch('/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    step: 2, 
                    mobile: mobileValue, 
                    token: tokenData.token 
                })
            });
            const orderData = await orderResponse.json();
            showResult(orderData.msg || '操作完成', 'success');
        }
    } catch (error) {
        showResult('请求失败: ' + error.message, 'error');
    }
}
