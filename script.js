document.addEventListener('DOMContentLoaded', function() {
    const executeBtn = document.getElementById('executeBtn');
    const mobileInput = document.getElementById('mobileInput');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    // CORS代理服务器（选择一个可用的）
    const PROXY_SERVERS = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://corsproxy.io/?',
        'https://proxy.cors.sh/'
    ];

    let currentProxyIndex = 0;

    executeBtn.addEventListener('click', function() {
        const mobileValue = mobileInput.value.trim();
        
        // 清空之前的结果
        resultDiv.style.display = 'none';
        
        // 验证手机号格式
        if (!/^1[3-9]\d{9}$/.test(mobileValue)) {
            showResult('号码格式错误！', 'error');
            return;
        }
        
        // 显示加载状态
        loadingDiv.style.display = 'block';
        executeBtn.disabled = true;
        
        // 开始执行请求流程
        executeRequest(mobileValue, currentProxyIndex);
    });

    function executeRequest(mobileValue, proxyIndex) {
        const proxyUrl = PROXY_SERVERS[proxyIndex];
        const targetUrl1 = 'https://hl-6-6.5521.site/hl-hl/ajax/verify/act/generate';
        const targetUrl2 = 'https://hl-6-6.5521.site/hl-hl/ajax/order/act/add';
        
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: 'slideDistance=504&slideWidth=549'
        };

        // 第一步：获取token（通过代理）
        fetch(proxyUrl + targetUrl1, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Token响应:', data);
            
            // 验证token获取是否成功
            if (data.code === 1 && data.msg === '验证Token生成成功') {
                // 第二步：提交订单
                const orderData = `mobile=${mobileValue}&time=20&verify_token=${data.token}`;
                return fetch(proxyUrl + targetUrl2, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: orderData
                });
            } else {
                throw new Error('获取token失败: ' + (data.msg || '未知错误'));
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('订单响应:', data);
            // 显示最终结果
            showResult(data.msg || '操作完成', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            
            // 如果当前代理失败，尝试下一个代理
            if (proxyIndex < PROXY_SERVERS.length - 1) {
                showResult(`正在尝试备用服务器... (${proxyIndex + 1}/${PROXY_SERVERS.length})`, 'info');
                setTimeout(() => {
                    executeRequest(mobileValue, proxyIndex + 1);
                }, 1000);
            } else {
                let errorMessage = '所有代理服务器都失败了，请稍后重试或联系管理员';
                
                if (error.message.includes('token')) {
                    errorMessage = error.message;
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = '网络请求被阻止，可能是CORS限制。请尝试刷新页面或稍后重试。';
                }
                
                showResult(errorMessage, 'error');
                
                // 重置代理索引
                currentProxyIndex = 0;
            }
        })
        .finally(() => {
            // 如果是最后一个请求才隐藏加载状态
            if (proxyIndex >= PROXY_SERVERS.length - 1) {
                loadingDiv.style.display = 'none';
                executeBtn.disabled = false;
            }
        });
    }

    // 显示结果函数
    function showResult(message, type) {
        resultDiv.textContent = message;
        resultDiv.style.display = 'block';
        
        if (type === 'success') {
            resultDiv.style.borderLeftColor = '#2ed573';
            resultDiv.style.backgroundColor = '#f8fff9';
        } else if (type === 'error') {
            resultDiv.style.borderLeftColor = '#ff4757';
            resultDiv.style.backgroundColor = '#fff8f8';
        } else {
            resultDiv.style.borderLeftColor = '#ffa502';
            resultDiv.style.backgroundColor = '#fff9f2';
        }
    }

    // 添加回车键支持
    mobileInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            executeBtn.click();
        }
    });
});
