// 这个文件需要部署到支持Serverless函数的平台
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { step, mobile, token } = req.body;

    try {
        const cookies = 'PHPSESSID=1cd4bcf0e4f37f311cd61fd2b9b41df0; server_name_session=3342d47cd4f6eec4f75e965786ef505a; Let_IndexUsername=hongzha9; Let_IndexPassword=5d2a29e4522956ea3273b338f0784100';

        if (step === 1) {
            // 第一步：获取token
            const response = await fetch('https://hl-6-6.5521.site/hl-hl/ajax/verify/act/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': cookies
                },
                body: 'slideDistance=504&slideWidth=549'
            });
            const data = await response.json();
            res.json(data);
        } else if (step === 2) {
            // 第二步：提交订单
            const response = await fetch('https://hl-6-6.5521.site/hl-hl/ajax/order/act/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': cookies
                },
                body: `mobile=${mobile}&time=20&verify_token=${token}`
            });
            const data = await response.json();
            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
