import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    customerUser,
    createOrder,
    navigateTo,
    appliedOffer,
    t
  } = useApp();

  // Form Fields
  const [name, setName] = useState(customerUser?.name || 'Rajesh Kulkarni');
  const [phone, setPhone] = useState(customerUser?.phone || '+91 98220 44521');
  const [email, setEmail] = useState(customerUser?.email || 'rajesh.kulkarni@gmail.com');
  const [street, setStreet] = useState('Flat 402, Anand Heights, Kothrud');
  const [landmark, setLandmark] = useState('Near City Pride Multiplex');
  const [city, setCity] = useState(customerUser?.city || 'Pune');
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('411038');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI' | 'Card'>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 40;
  const discountAmount = appliedOffer
    ? Math.round((subtotal * appliedOffer.discountPercent) / 100)
    : 0;
  const totalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Quick demo autofill for judges
  const handleAutofillNashik = () => {
    setName('Gauri Deshpande');
    setPhone('+91 94231 88990');
    setEmail('gauri.d@gmail.com');
    setStreet('Plot 14, Suyojit Garden, Gangapur Road');
    setLandmark('Opp. Navshya Ganpati Mandir');
    setCity('Nashik');
    setDistrict('Nashik');
    setState('Maharashtra');
    setPincode('422013');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      navigateTo('products');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.image,
        weight: item.selectedWeight,
        price: item.unitPrice,
        quantity: item.quantity
      }));

      const newOrderId = createOrder({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        address: {
          street,
          landmark,
          city,
          district,
          state,
          pincode
        },
        items: orderItems,
        subtotal,
        deliveryCharge: deliveryFee,
        discount: discountAmount,
        total: totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        status: 'Pending',
        estimatedDelivery: '3 to 5 business days'
      });

      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }

      setIsSubmitting(false);
      navigateTo('order-success', { orderId: newOrderId });
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[#2C221E]">Your cart is empty.</h2>
        <button
          onClick={() => navigateTo('products')}
          className="mt-4 px-6 py-2.5 bg-[#1E4D2B] text-white font-bold rounded-xl"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb / Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('cart')}
          className="text-xs sm:text-sm font-bold text-[#5C4A3E] hover:text-[#1E4D2B] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <button
          type="button"
          onClick={handleAutofillNashik}
          className="text-xs font-semibold text-[#1E4D2B] bg-[#FAF4EC] hover:bg-[#F3ECE4] px-3 py-1.5 rounded-lg border border-[#E8DEC8]"
        >
          ⚡ Autofill Sample Address (Nashik)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-4">
              <h2 className="text-lg font-bold font-serif text-[#2C221E] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1E4D2B] text-white text-xs flex items-center justify-center font-sans">
                  1
                </span>
                <span>{t('stepCustomerDetails')}</span>
              </h2>
              <span className="text-xs text-[#735F50]">Required for delivery notifications</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2C221E] block mb-1">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2C221E] block mb-1">
                  {t('mobileNumber')} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#2C221E] block mb-1">
                  {t('emailAddress')} (For e-bill & tracking)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-4">
              <h2 className="text-lg font-bold font-serif text-[#2C221E] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1E4D2B] text-white text-xs flex items-center justify-center font-sans">
                  2
                </span>
                <span>{t('stepDeliveryAddress')}</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#2C221E] block mb-1">
                  {t('streetAddress')} *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2C221E] block mb-1">
                  {t('landmark')}
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs sm:text-sm text-[#2C221E] focus:bg-white focus:outline-hidden focus:border-[#1E4D2B]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#2C221E] block mb-1">
                    {t('city')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2C221E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2C221E] block mb-1">
                    {t('district')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2C221E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2C221E] block mb-1">
                    {t('state')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2C221E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2C221E] block mb-1">
                    {t('pincode')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5C6B5] rounded-xl text-xs text-[#2C221E]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method (DEMO ONLY) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-4">
              <h2 className="text-lg font-bold font-serif text-[#2C221E] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1E4D2B] text-white text-xs flex items-center justify-center font-sans">
                  3
                </span>
                <span>{t('stepPaymentMethod')}</span>
              </h2>
              <span className="text-[11px] font-bold text-[#C85A32] bg-amber-50 px-2 py-0.5 rounded-full">
                Demo Mode
              </span>
            </div>

            <div className="space-y-3">
              {/* Option 1: COD */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#1E4D2B] bg-[#FAF7F2] ring-2 ring-[#1E4D2B]/10'
                    : 'border-[#E5DACD] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="w-4 h-4 text-[#1E4D2B] accent-[#1E4D2B]"
                  />
                  <div>
                    <span className="font-bold text-sm text-[#2C221E] block">
                      {t('paymentCod')}
                    </span>
                    <span className="text-xs text-[#735F50]">
                      Pay in cash or UPI when order reaches your door
                    </span>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-[#1E4D2B]" />
              </label>

              {/* Option 2: UPI */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-[#1E4D2B] bg-[#FAF7F2] ring-2 ring-[#1E4D2B]/10'
                    : 'border-[#E5DACD] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="w-4 h-4 text-[#1E4D2B] accent-[#1E4D2B]"
                  />
                  <div>
                    <span className="font-bold text-sm text-[#2C221E] block">
                      {t('paymentUpi')}
                    </span>
                    <span className="text-xs text-[#735F50]">
                      Instant QR Code & UPI handles simulated for demo
                    </span>
                  </div>
                </div>
                <QrCode className="w-5 h-5 text-[#C85A32]" />
              </label>

              {/* Option 3: Card */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Card'
                    ? 'border-[#1E4D2B] bg-[#FAF7F2] ring-2 ring-[#1E4D2B]/10'
                    : 'border-[#E5DACD] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={() => setPaymentMethod('Card')}
                    className="w-4 h-4 text-[#1E4D2B] accent-[#1E4D2B]"
                  />
                  <div>
                    <span className="font-bold text-sm text-[#2C221E] block">
                      {t('paymentCard')}
                    </span>
                    <span className="text-xs text-[#735F50]">
                      Visa / Mastercard / RuPay demo simulation
                    </span>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-[#1E4D2B]" />
              </label>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              {t('demoPaymentNotice')}
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            id="place-order-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-8 rounded-2xl bg-[#1E4D2B] hover:bg-[#163E23] text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Placing Order with Nashik Kitchen...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{t('placeOrder')} (₹{totalAmount})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Right: Order Summary Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#E8DEC8] shadow-xs space-y-4">
            <h3 className="font-bold text-base font-serif text-[#2C221E] border-b border-[#F0E8DC] pb-3">
              Order Review ({cart.length} items)
            </h3>

            {/* Compact items list */}
            <div className="divide-y divide-[#F0E8DC] max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-[#FAF7F2] shrink-0 border border-[#E5DACD]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#2C221E] truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-[#735F50]">
                      {item.selectedWeight} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1E4D2B]">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs border-t border-[#F0E8DC] pt-4 text-[#5C4A3E]">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-[#2C221E]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('deliveryFee')}</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-700">{t('freeDelivery')}</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t('discount')} ({appliedOffer?.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-[#F0E8DC] text-sm">
                <span className="font-bold text-[#2C221E]">{t('totalAmount')}</span>
                <span className="text-xl font-black text-[#1E4D2B]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Trust highlights */}
            <div className="pt-2 space-y-2 text-[11px] text-[#735F50]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Dispatched directly from Jijamata SHG Kitchen, Nashik</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Homemade Guarantee & Freshness Sealed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
