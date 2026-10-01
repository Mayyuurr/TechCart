const ORDER_STATES = ['CART', 'CHECKOUT', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

function transitionOrderState(currentOrder, targetAction) {
  if (!currentOrder || !currentOrder.status) {
    const err = new Error('Invalid order object');
    err.statusCode = 400;
    throw err;
  }

  const currentStatus = currentOrder.status.toUpperCase();
  const action = (targetAction || '').toUpperCase();

  // Illegal State Guard: Cannot cancel shipped order
  if (currentStatus === 'SHIPPED' && action === 'CANCEL') {
    const error = new Error('Cannot cancel an order that has already been shipped');
    error.statusCode = 400;
    throw error;
  }

  switch (currentStatus) {
    case 'CART':
      if (action === 'CHECKOUT' || action === 'PROCEED_TO_CHECKOUT') return 'CHECKOUT';
      break;
    case 'CHECKOUT':
      if (action === 'PAY') return 'PAID';
      if (action === 'CANCEL') return 'CANCELLED';
      break;
    case 'PAID':
      if (action === 'SHIP') return 'SHIPPED';
      if (action === 'REFUND') return 'REFUNDED';
      break;
    case 'SHIPPED':
      if (action === 'DELIVER') return 'DELIVERED';
      break;
    default:
      break;
  }

  const error = new Error(`Invalid state transition from ${currentStatus} via action ${action}`);
  error.statusCode = 400;
  throw error;
}

module.exports = { ORDER_STATES, transitionOrderState };
