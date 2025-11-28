document.addEventListener('DOMContentLoaded', function() {
    const executeBtn = document.getElementById('executeBtn');
    const mobileInput = document.getElementById('mobileInput');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

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
        
        // 第一步：获取token
        fetchWithCookies('https://hl-6-6.5521.site/hl-hl/ajax/verify/act/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'slideDistance=504&slideWidth=549'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络请求失败');
            }
            return response.json();
        })
        .then(data => {
            console.log('Token响应:', data);
            // 验证token获取是否成功
            if (data.code === 1 && data.msg === '验证Token生成成功') {
                // 第二步：提交订单
                return fetchWithCookies('https://hl-6-6.5521.site/hl-hl/ajax/order/act/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `mobile=${mobileValue}&time=20&verify_token=${data.token}`
                });
            } else {
                throw new Error('获取token失败: ' + (data.msg || '未知错误'));
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络请求失败');
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
            let errorMessage = '请求失败，请检查网络连接！';
            
            if (error.message.includes('token')) {
                errorMessage = error.message;
            } else if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
                errorMessage = '网络请求被阻止，请参考页面说明解决问题';
            }
            
            showResult(errorMessage, 'error');
        })
        .finally(() => {
            // 隐藏加载状态
            loadingDiv.style.display = 'none';
            executeBtn.disabled = false;
        });
    });

    // 带cookies的fetch请求
    function fetchWithCookies(url, options) {
        const cookies = 'PHPSESSID=1cd4bcf0e4f37f311cd61fd2b9b41df0; server_name_session=3342d47cd4f6eec4f75e965786ef505a; Let_IndexUsername=hongzha9; Let_IndexPassword=5d2a29e4522956ea3273b338f0784100';
        
        return fetch(url, {
            ...options,
            credentials: 'omit', // 修改为 omit，因为我们在header中手动设置了Cookie
            headers: {
                ...options.headers,
                'Cookie': cookies
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
        } else {
            resultDiv.style.borderLeftColor = '#ff4757';
            resultDiv.style.backgroundColor = '#fff8f8';
        }
    }

    // 添加回车键支持
    mobileInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            executeBtn.click();
        }
    });
});
