const http = require('http');

const request = (method, path, data, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(responseData) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

async function runTests() {
    console.log("Starting Tests...\n");
    let token = "";
    let userId = "";

    const uniqueSuffix = Date.now().toString(36);
    const userPayload = {
        name: "Nutricionista Teste",
        email: `nutri_${uniqueSuffix}@example.com`,
        password: "password123",
        cpf: `321${uniqueSuffix.substring(0, 8)}`,
        phone: "888888888",
        birthdate: "1985-05-05",
        address: "Av Alimentação 456",
        role: "trainer"
    };

    try {
        // 1. Register User
        console.log("[1] Testing POST /api/auth/register...");
        let res = await request('POST', '/api/auth/register', userPayload);
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${JSON.stringify(res.data)}\n`);
        if (res.status !== 201) throw new Error("Registration Failed");

        // 2. Login User
        console.log("[2] Testing POST /api/auth/login...");
        res = await request('POST', '/api/auth/login', {
            email: userPayload.email,
            password: userPayload.password
        });
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${JSON.stringify(res.data)}\n`);
        if (res.status !== 200) throw new Error("Login Failed");

        token = res.data.token;
        userId = res.data.user._id;

        // 3. Get All Users (Auth required)
        console.log("[3] Testing GET /api/users...");
        res = await request('GET', '/api/users', null, token);
        console.log(`Status: ${res.status}`);
        console.log(`Response: Found ${Array.isArray(res.data) ? res.data.length : 'unknown'} users.\n`);

        // 4. Create Professional
        console.log("[4] Testing POST /api/professionals...");
        res = await request('POST', '/api/professionals', {
            userId: userId,
            type: "Nutricionista"
        }, token);
        console.log(`Status: ${res.status}`);
        console.log(`Response: ${JSON.stringify(res.data)}\n`);

        const professionalId = res.data._id ? res.data._id : null;

        if (professionalId) {
            // 5. Get Professionals by Type
            console.log("[5] Testing GET /api/professionals/type/Nutricionista...");
            res = await request('GET', '/api/professionals/type/Nutricionista', null, token);
            console.log(`Status: ${res.status}`);
            console.log(`Response: Found ${Array.isArray(res.data) ? res.data.length : 'unknown'} professionals.\n`);
        }

        console.log("ALL TESTS COMPLETED OKEY.");
    } catch (err) {
        console.error("Test execution stopped with error:", err.message);
    }
}

runTests();
