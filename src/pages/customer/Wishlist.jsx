import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";

import {
  FiHeart,
  FiShoppingCart,
} from "react-icons/fi";

function Wishlist() {

  const products = [
    {
      id: 1,
      name: "Apple AirPods Pro",
      price: "₹24,999",
      image: "🎧",
    },
    {
      id: 2,
      name: "Gaming Mouse",
      price: "₹2,999",
      image: "🖱️",
    },
    {
      id: 3,
      name: "Mechanical Keyboard",
      price: "₹5,499",
      image: "⌨️",
    },
  ];

  return (
    <DashboardLayout role="customer">

      <PageHeader
        title="Wishlist"
        subtitle="Products you have saved for later."
      />

      {products.length === 0 ? (

        <EmptyState
          title="Wishlist is Empty"
          subtitle="Start adding products to your wishlist."
        />

      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {products.map((product) => (

            <div
              key={product.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-500"
            >

              <div className="flex justify-between">

                <div className="text-6xl">
                  {product.image}
                </div>

                <button className="text-pink-500">
                  <FiHeart size={24} />
                </button>

              </div>

              <h2 className="mt-6 text-xl font-semibold text-white">
                {product.name}
              </h2>

              <p className="mt-2 text-2xl font-bold text-violet-400">
                {product.price}
              </p>

              <button
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-white transition hover:bg-violet-700"
              >

                <FiShoppingCart />

                Add to Cart

              </button>

            </div>

          ))}

        </div>

      )}

    </DashboardLayout>
  );
}

export default Wishlist;