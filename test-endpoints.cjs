const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing Welcome Email ---');
  const res1 = await post('/api/notifications/welcome', {
    email: 'delivered@resend.dev',
    name: 'Sarah Vance',
    entityType: 'organization',
    entityName: 'ApexFlow Technologies Inc.',
    uuid: 'usr_sec_8491028'
  });
  console.log('Welcome response:', res1.statusCode, res1.body);

  console.log('\n--- 2. Testing Record Created Notification ---');
  const res2 = await post('/api/notifications/record-created', {
    recordId: 'REC-2026-904',
    vendor: 'Snowflake Cloud Data',
    amount: 6350,
    currency: 'USD',
    entityName: 'ApexFlow Technologies Inc.',
    invoiceId: 'SNOW-INV-2026-9041',
    details: 'Status: inserted, waiting for confirmation from peer',
    deepLinkUrl: 'http://localhost:3000/',
    peerName: 'Snowflake AR Enclave',
    recipientEmail: 'delivered@resend.dev'
  });
  console.log('Record Created response:', res2.statusCode, res2.body);

  console.log('\n--- 3. Testing Verification Success Notification ---');
  const res3 = await post('/api/notifications/verification-success', {
    email: 'delivered@resend.dev',
    name: 'Sarah Vance',
    entityType: 'organization',
    verifiedTimestamp: '2026-09-04T20:30:00 UTC',
    ipAddress: '198.51.100.42'
  });
  console.log('Verification Success response:', res3.statusCode, res3.body);

  console.log('\n--- 4. Testing Scheduled Payment Reminder Notification ---');
  const res4 = await post('/api/notifications/payment-reminder', {
    paymentId: 'PAY-8921',
    invoiceId: 'INV-2026-DD-8819',
    vendor: 'Datadog Enterprise Cloud',
    amount: 9120,
    currency: 'USD',
    dueDate: '2026-09-12',
    isOverdue: true,
    penaltyFee: 450,
    directLink: 'http://localhost:3000/',
    entityName: 'ApexFlow Technologies Inc.',
    instructions: [
      '1. Review contract discrepancy for Datadog ($3,360 variance).',
      '2. Remit approved funds via ACH/Escrow wire.',
      '3. Remittance required within 48h to prevent compounding statutory penalties.'
    ],
    recipientEmail: 'delivered@resend.dev'
  });
  console.log('Payment Reminder response:', res4.statusCode, res4.body);
}

run().catch(console.error);
