// app/view-transactions/page.tsx

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function ViewTransactionsPage() {
    const supabase = createServerComponentClient({
        cookies: () => Promise.resolve(cookies())  // pass a function returning a Promise
      })

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date_charged", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error.message);
    return <div>Failed to load transactions</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((txn) => (
            <li key={txn.id} className="border rounded-xl p-4 shadow">
              <p>
                <strong>Amount:</strong> ${txn.amount}
              </p>
              <p>
                <strong>Name:</strong> {txn.name}
              </p>
              <p>
                <strong>Category:</strong> {txn.category}
              </p>
              <p>
                <strong>Type:</strong> {txn.type}
              </p>
              <p>
                <strong>Notes:</strong> {txn.notes}
              </p>
              <p>
                <strong>Card Used:</strong> {txn.card}
              </p>
              <p>
                <strong>Date Charged:</strong>{" "}
                {new Date(txn.date_charged).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
