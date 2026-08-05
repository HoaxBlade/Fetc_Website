import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, ChevronDown } from 'lucide-react';
import { getApiUrl } from '../../apiConfig';

const UserPayments = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  const isPaymentsPage = location.pathname.includes('/payments');
  const pageTitle = isPaymentsPage ? 'Online Payments' : 'My Orders';
  const emptyText = isPaymentsPage ? 'You have no online payment transactions yet.' : 'You have not placed any orders yet.';

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const emailParam = user?.email ? `email=${encodeURIComponent(user.email)}` : '';
      const phoneParam = user?.phone ? `phone=${encodeURIComponent(user.phone)}` : '';
      const queryStr = [emailParam, phoneParam].filter(Boolean).join('&');

      const targetUrl = getApiUrl(`/api/v1/order/user-orders${queryStr ? '?' + queryStr : ''}`);
      const response = await fetch(targetUrl, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || data.transactions || []);
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrder = (id) => {
    setOpenOrderId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'SUCCESS' || s === 'PAID' || s === 'COMPLETED') {
      return (
        <span className="bg-[#10b981] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
          SUCCESS
        </span>
      );
    }
    if (s === 'PENDING' || s === 'INITIATED') {
      return (
        <span className="bg-[#f59e0b] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
          PENDING
        </span>
      );
    }
    return (
      <span className="bg-[#ef4444] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
        FAILED
      </span>
    );
  };

  const getTitle = (order) => {
    if (order.courseName) return order.courseName;
    if (order.productName) return order.productName;
    if (order.courseId === 'CAREER_ASSESSMENT') return 'Career Assessment';
    if (order.courseId) return order.courseId.replace(/_/g, ' ');
    if (order.productType) return order.productType.replace(/_/g, ' ');
    return (isPaymentsPage ? 'Transaction #' : 'Order #') + (order.id || '');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{pageTitle}</h1>

      {orders.length === 0 ? (
        <p className="text-slate-500 font-medium">
          {emptyText}
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderId = order.id || order._id || order.transactionId;
            const isOpen = openOrderId === orderId;
            const status = (order.status || 'PENDING').toUpperCase();
            const title = getTitle(order);
            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'N/A';

            return (
              <div
                key={orderId}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Header */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer select-none"
                  onClick={() => toggleOrder(orderId)}
                >
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {formattedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(status)}
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Details */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-sm text-slate-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <p>
                        <strong className="text-slate-900">Amount:</strong> ₹
                        {Number(order.amount || 0).toFixed(2)}
                      </p>

                      <p className="font-mono text-xs">
                        <strong className="font-sans text-sm text-slate-900 font-bold">Transaction ID:</strong>{' '}
                        {order.transactionId || order.merchant_transaction_id || 'N/A'}
                      </p>

                      <p>
                        <strong className="text-slate-900">Payment Method:</strong>{' '}
                        {order.method || 'Online (PhonePe Gateway)'}
                      </p>

                      <p>
                        <strong className="text-slate-900">Date:</strong>{' '}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : 'N/A'}
                      </p>

                      {order.courseId && (
                        <p>
                          <strong className="text-slate-900">Course / Test ID:</strong>{' '}
                          {order.courseId}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {status === 'SUCCESS' && (
                      <div className="pt-2">
                        <button
                          onClick={() => navigate('/career-assessment/behaviour-and-career-analysis')}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
                        >
                          View Assessment
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserPayments;
