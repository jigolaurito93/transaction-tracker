"use client";

import { supabase } from '@/lib/supabase'
import { ChangeEvent, FormEvent, useState } from "react";

// interface Transaction {
//   name: string;
//   amount: number;
//   category: string;
//   type: "needs" | "wants" | "income";
//   card_used: string;
//   notes?: string; // optional
//   date_charged: string; // or Date
// }

export default function AddTransactionPage() {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    type: "needs",
    card_used: "",
    notes: "",
    date_charged: "",
  });

  const amountFormatted = Number(parseFloat(form.amount).toFixed(2))

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(form);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("transactions").insert([
      {
        ...form,
        amount: amountFormatted,
      },
    ]);

    if (error) {
      alert("Failed to add transaction: " + error.message);
    } else {
      alert("Transaction added!");
      setForm({
        name: "",
        amount: "",
        category: "",
        type: "needs",
        card_used: "",
        notes: "",
        date_charged: "",
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className=" border flex flex-col w-lg mx-auto mt-20 rounded-lg p-8 gap-3"
      >
        <div className="flex flex-col">
          <label htmlFor="" className="text-sm">
            Transaction
          </label>
          <input
            name="name"
            className="border-b focus:outline-none "
            placeholder=""
            defaultValue={1.0}
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="needs">Needs</option>
          <option value="wants">Wants</option>
          <option value="income">Income</option>
        </select>
        <input
          name="card_used"
          placeholder="Card Used"
          value={form.card_used}
          onChange={handleChange}
          required
        />
        <input
          name="date_charged"
          type="date"
          value={form.date_charged}
          onChange={handleChange}
          required
        />
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="border rounded p-1 w-fit mx-auto cursor-pointer"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}
