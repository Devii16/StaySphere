import crypto from 'crypto';

// ---------------------------------------------------------------------------
// SIMULATED PAYMENT GATEWAY
// No real money moves here. It validates the input like a gateway would and
// returns a fake transaction id. To go live, replace processPayment() with a call
// to Razorpay / Stripe / PayU (create order server-side, verify the signature).
//
// Test card numbers:  4242 4242 4242 4242 -> succeeds
//                     4000 0000 0000 0002 -> declined
// ---------------------------------------------------------------------------

function luhnValid(num) {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}

function txnId(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

export function processPayment({ method, details = {}, amount }) {
  switch (method) {
    case 'card': {
      const number = String(details.cardNumber || '').replace(/\s+/g, '');
      const expiry = String(details.expiry || '');
      const cvv = String(details.cvv || '');
      const name = String(details.cardName || '').trim();
      if (!/^\d{13,19}$/.test(number) || !luhnValid(number)) return fail('Invalid card number.');
      const m = expiry.match(/^(\d{2})\/(\d{2})$/);
      if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return fail('Expiry must be MM/YY.');
      const expEnd = new Date(2000 + Number(m[2]), Number(m[1]), 1); // first day after expiry month
      if (expEnd <= new Date()) return fail('This card has expired.');
      if (!/^\d{3,4}$/.test(cvv)) return fail('Invalid CVV.');
      if (!name) return fail('Enter the name on the card.');
      if (number.endsWith('0002')) return fail('Your card was declined by the bank.');
      return ok(txnId('CARD'), `Card ending ${number.slice(-4)}`);
    }
    case 'upi': {
      const upi = String(details.upiId || '').trim();
      if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi)) return fail('Enter a valid UPI ID (e.g. name@bank).');
      return ok(txnId('UPI'), `UPI: ${upi}`);
    }
    case 'netbanking': {
      const bank = String(details.bank || '').trim();
      if (!bank) return fail('Select a bank.');
      return ok(txnId('NB'), `Net banking: ${bank}`);
    }
    case 'pay_at_hotel':
      return { ok: true, status: 'pending', transactionId: undefined, detail: 'Pay at hotel during check-out' };
    default:
      return fail('Choose a payment method.');
  }

  function ok(transactionId, detail) {
    return { ok: true, status: 'paid', transactionId, detail, amount, paidAt: new Date() };
  }
  function fail(message) {
    return { ok: false, message };
  }
}
