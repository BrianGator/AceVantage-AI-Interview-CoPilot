import React, { useState } from "react";
import {
  Users,
  CreditCard,
  Mail,
  Trash2,
  Search,
  DollarSign,
} from "lucide-react";

export const Admin = ({ onLogout }: { onLogout: () => void }) => {
  const [monthlyPrice, setMonthlyPrice] = useState("0");
  // Mock user list
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Brian McCarthy",
      email: "briansmc@gmail.com",
      usage: 142,
      joined: "2023-11-12",
    },
    {
      id: "2",
      name: "Alice Smith",
      email: "alice@example.com",
      usage: 35,
      joined: "2024-01-05",
    },
    {
      id: "3",
      name: "John Doe",
      email: "john@example.com",
      usage: 12,
      joined: "2024-02-18",
    },
  ]);

  const handlePriceUpdate = () => {
    alert(
      `Pricing updated to $${monthlyPrice}/month. Emails sent to all users notifying them of the payment requirement.`,
    );
  };

  const handleSendEmail = (email: string) => {
    alert(`Email drafted to user: ${email}`);
  };

  const handleRemoveUser = (id: string) => {
    if (
      confirm(
        "Are you sure you want to remove this user? This cannot be undone.",
      )
    ) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="h-screen w-full bg-neutral-950 flex flex-col text-white">
      <div className="border-b border-neutral-800 bg-neutral-900 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <Users size={20} />
          </div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-neutral-400 hover:text-white"
        >
          Sign Out
        </button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto w-full max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pricing Settings */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-green-400" /> Subscription
              Pricing
            </h2>
            <p className="text-neutral-400 text-sm mb-6">
              Manage the monthly subscription fee. Currently, new users are set
              to free. Updating this will notify all active free tier users.
            </p>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <DollarSign
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                  size={16}
                />
                <input
                  type="number"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                />
              </div>
              <span className="text-neutral-400">/ month</span>
            </div>
            <button
              onClick={handlePriceUpdate}
              className="mt-6 w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl transition-colors border border-neutral-700"
            >
              Update Pricing & Notify Users
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-center">
              <span className="text-neutral-400 text-sm font-bold uppercase tracking-widest mb-2">
                Total Users
              </span>
              <span className="text-5xl font-black">{users.length}</span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-center">
              <span className="text-neutral-400 text-sm font-bold uppercase tracking-widest mb-2">
                Avg Usage
              </span>
              <span className="text-5xl font-black text-blue-400">
                {Math.round(
                  users.reduce((acc, u) => acc + u.usage, 0) /
                    (users.length || 1),
                )}
              </span>
            </div>
          </div>
        </div>

        {/* User Tracking Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-800/20">
            <h2 className="text-xl font-bold">User Management & Tracking</h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Search users..."
                className="bg-neutral-950 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 outline-none text-sm focus:border-blue-500 w-64"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 bg-neutral-900">
                <th className="p-4 font-semibold pl-6">Name</th>
                <th className="p-4 font-semibold">Email Account</th>
                <th className="p-4 font-semibold">Joined Date</th>
                <th className="p-4 font-semibold">Total Usage (Queries)</th>
                <th className="p-4 font-semibold text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-neutral-800/50 hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="p-4 pl-6 font-medium">{u.name}</td>
                  <td className="p-4 text-neutral-400 text-sm">{u.email}</td>
                  <td className="p-4 text-neutral-400 text-sm">{u.joined}</td>
                  <td className="p-4 font-mono text-sm text-blue-400">
                    {u.usage}
                  </td>
                  <td className="p-4 pr-6 flex justify-end gap-2">
                    <button
                      onClick={() => handleSendEmail(u.email)}
                      className="p-2 bg-neutral-800 text-neutral-300 hover:text-white rounded-lg transition-colors border border-neutral-700"
                      title={`Draft email to ${u.name}`}
                    >
                      <Mail size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveUser(u.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                      title={`Remove ${u.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
