import { Link } from "react-router-dom";
import Layout from "../../components/layout/layout";

function Success() {
  return (
    <Layout>
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            🎉 Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. You can view it in your
            orders page.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/order"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              View Orders
            </Link>
            <Link
              to="/"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Success;
