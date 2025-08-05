"use client";

import { supabase } from "@/lib/supabase";
import { ChangeEvent, FormEvent, useState } from "react";

interface Transaction {
  name: string;
  amount: string;
  category: string;
  type: "needs" | "wants" | "income" | "transfer";
  card_used: string;
  notes?: string; // optional
  date_charged: string; // or Date
}

const categories = [
  "Bank Fees",
  "Childcare",
  "Dining",
  "Donations",
  "Education",
  "Entertainment",
  "Government",
  "Groceries",
  "Health",
  "Home Improvement",
  "Income",
  "Insurance",
  "Loan Payments",
  "Mortgage",
  "Other",
  "Personal Care",
  "Pets",
  "Rent",
  "Services",
  "Shopping",
  "Transportation",
  "Travel",
  "Utilities",
];

const wantsCategories = [
  "dining",
  "donations",
  "entertainment",
  "homeimprovement",
  "other",
  "personalcare",
  "services",
  "shopping",
  "travel",
];

export default function AddTransactionPage() {
  const [form, setForm] = useState<Transaction>({
    name: "",
    amount: "",
    category: "",
    type: "needs",
    card_used: "",
    notes: "",
    date_charged: "",
  });

  const amountFormatted = Number(parseFloat(form.amount).toFixed(2));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (wantsCategories.includes(form.category)) {
      setForm((prev) => ({
        ...prev,
        type: "wants",
      }));
    } else if (form.category === "income") {
      setForm((prev) => ({
        ...prev,
        type: "income",
      }));
    } else if (form.category === "internaltransfer") {
      setForm((prev) => ({
        ...prev,
        type: "transfer",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        type: "needs",
      }));
    }
    console.log(form);
    console.log(form.type);
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

        <select name="category" onChange={handleChange}>
          {categories.map((category, i) => (
            <option value={category.replace(/\s+/g, "").toLowerCase()}>
              {category}
            </option>
          ))}
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
