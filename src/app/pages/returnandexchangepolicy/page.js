import React from 'react';
import Head from 'next/head';

const ReturnPolicy = () => {
  return (
    <>
      <Head>
        <title>Return and Exchange Policy - Sparesonwheel.com</title>
      </Head>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Return and Exchange Policy</h1>
         {/* <p className="text-sm text-gray-500 mb-4">Last Updated: 2-8-2024</p> */}
        <p className="mb-4">
          At Sparesonwheel.com, we strive to provide you with the best shopping experience possible. If you are not entirely satisfied with your purchase, we're here to help. This return and exchange policy explains the terms under which you can return or exchange items purchased from our website, <a href="http://www.Sparesonwheel.com" className="text-blue-500 hover:underline">www.Sparesonwheel.com</a>.
        </p>

        <h2 className="text-2xl font-semibold mb-4">1. Returns</h2>
        <h3 className="text-xl font-semibold mb-2">Eligibility for Returns:</h3>
        <ul className="list-disc list-inside mb-8">
          <li className="mb-2">Items must be returned within 7 days of the purchase date.</li>
          <li className="mb-2">Items must be unused, in the same condition that you received them, and in the original packaging.</li>
          <li className="mb-2">Certain types of items cannot be returned, such as perishable goods (e.g., food, flowers), custom products (e.g., special orders, personalized items), and personal care goods (e.g., beauty products).</li>
          <li className="mb-2">You must make a short video of opening the parcel to use as evidence for damage or broken item refund or exchange.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">Non-returnable Items:</h3>
        <ul className="list-disc list-inside mb-8">
          <li className="mb-2">Gift cards</li>
          <li className="mb-2">Downloadable software products</li>
          <li className="mb-2">Some health and personal care items</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">Return Process:</h3>
        <ol className="list-decimal list-inside mb-8">
          <li className="mb-2">To initiate a return, please contact our customer support team at <a href="info@Sparesonwheel.com" className="text-blue-500 hover:underline">info@Sparesonwheel.com</a> with your order number and the reason for the return.</li>
          <li className="mb-2">Once your return is approved, we will provide you with a return shipping address and instructions.</li>
          <li className="mb-2">Pack the item securely in its original packaging, including all tags, instructions, and any accessories that came with the item.</li>
          <li className="mb-2">Ship the item to the provided address.</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Refunds:</h3>
        <p className="mb-8">
          Once we receive your item, we will inspect it and notify you of the approval or rejection of your refund.<br />
          If your return is approved, we will process a refund to your original method of payment within 7-10 business days. The time it takes for the refund to appear on your account may vary depending on your payment provider.
        </p>

        <h3 className="text-xl font-semibold mb-2">Return Shipping Costs:</h3>
        <p className="mb-8">
          You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.<br />
          If you receive a refund, the cost of return shipping will be deducted from your refund.
        </p>

        <h2 className="text-2xl font-semibold mb-4">2. Exchanges</h2>
        <h3 className="text-xl font-semibold mb-2">Eligibility for Exchanges:</h3>
        <p className="mb-8">
          We only replace items if they are defective or damaged. If you need to exchange an item for the same product, please contact us at <a href="mailto:info@Sparesonwheel.com" className="text-blue-500 hover:underline">info@Sparesonwheel.com</a>.
        </p>

        <h3 className="text-xl font-semibold mb-2">Exchange Process:</h3>
        <ol className="list-decimal list-inside mb-8">
          <li className="mb-2">To initiate an exchange, please contact our customer support team at <a href="mailto:exchanges@Sparesonwheel.com.ca" className="text-blue-500 hover:underline">info@Sparesonwheel.com</a> with your order number, details of the defect or damage, and any supporting photos.</li>
          <li className="mb-2">Once your exchange is approved, we will provide you with further instructions.</li>
          <li className="mb-2">Pack the item securely in its original packaging and ship it to the provided address.</li>
          <li className="mb-2">Once we receive the item and inspect it, we will send you a replacement.</li>
        </ol>

        <h3 className="text-xl font-semibold mb-2">Shipping for Exchanges:</h3>
        <p className="mb-8">
          We will cover the shipping costs for sending the replacement item to you if the exchange is due to a defect or damage.<br />
          If the item is not available for an exchange, we will issue a full refund including original shipping costs.
        </p>

        <h2 className="text-2xl font-semibold mb-4">3. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about our return and exchange policy, please contact us at <a href="info@Sparesonwheel.com" className="text-blue-500 hover:underline">info@Sparesonwheel.com</a> or by mail at:
        </p>
        <address className="mb-8">
          Sparesonwheel.com<br />
          Tahir Sajjad<br />
          PO Chak No. 356/jb Khalsa Abad, Tehsil Gojra,District Toba Tek Singh, Punjab, Pakistan<br></br>
          56000<br />
          Pakistan<br />
          +923310356111<br />
          <a href="info@Sparesonwheel.com" className="text-blue-500 hover:underline">info@Sparesonwheel.com</a>
        </address>
      </div>
    </>
  );
};

export default ReturnPolicy;
