import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const API_URL = "http://127.0.0.1:5000";

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("ERROR FETCH USERS:", error);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      void fetchUsers();
    }, 0);
  }, [fetchUsers]);

  const handleRoleChange = async (id, role) => {
    await fetch(`${API_URL}/api/admin/users/${id}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    fetchUsers();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus User?",
      text: "Data user akan dihapus dari sistem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "DELETE",
    });

    await fetchUsers();

    Swal.fire({
      icon: "success",
      title: "User Dihapus",
      timer: 1400,
      showConfirmButton: false,
    });
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-8 space-y-6">
        <Topbar />

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Users Management
          </h1>
          <p className="text-slate-500">
            Kelola akun customer dan admin sistem homestay.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Daftar User</h2>

          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="text-left border-b text-slate-500 bg-slate-50">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Nama</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Created At</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-500">
                    Belum ada user.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-slate-50">
                    <td className="py-4 px-3">#{user.id}</td>
                    <td className="py-4 px-3 font-medium">{user.nama}</td>
                    <td className="py-4 px-3">{user.email}</td>
                    <td className="py-4 px-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="border rounded-lg px-3 py-2"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-3">{user.created_at}</td>
                    <td className="py-4 px-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}