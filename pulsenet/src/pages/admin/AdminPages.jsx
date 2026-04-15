import React, { useState, useEffect } from 'react';
import { StatCard, Card, Table, Badge, FormField, Input, Select, SectionHeader } from '../../components/ui';
import { Users, UserCog, Building2, DollarSign, FileText, Activity, Plus, Trash2, Edit3 } from 'lucide-react';
import { patients, staff, charges } from '../../data/mockData';

 

export function AdminDashboard() {

  const [data, setData] = useState({});
  const [rooms, setRooms] = useState([]);

  // 🔥 Fetch dashboard stats
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  // 🔥 Fetch rooms (IMPORTANT FIX)
  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then(res => res.json())
      .then(setRooms);
  }, []);

  // 🔥 Stats
  const stats = [
    {
      title: "Total Patients",
      value: data.totalPatients || 0,
    },
    {
      title: "Doctors",
      value: data.doctors || 0,
    },
    {
      title: "Nurses",
      value: data.nurses || 0,
    },
    {
      title: "Active Admissions",
      value: data.activeAdmissions || 0,
    }
  ];

  const patients = data.recent || [];

  // 🔥 Safe calculations (NO NaN)
  const totalBeds = rooms.reduce((sum, r) => sum + (r.beds || 0), 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + (r.occupied || 0), 0);
  const availableBeds = totalBeds - occupiedBeds;

  const icuRooms = rooms.filter(r => r.type === "ICU");
  const icuOccupied = icuRooms.reduce((sum, r) => sum + (r.occupied || 0), 0);
  const icuBeds = icuRooms.reduce((sum, r) => sum + (r.beds || 0), 0);

  return (
    <div>

      <SectionHeader
        title="Admin Dashboard"
        subtitle="PulseNet Hospital Management Overview"
      />

      {/* 🔥 TOP STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <Card key={s.title} className="p-4">
            <p className="text-xs text-slate-500">{s.title}</p>
            <h2 className="text-xl font-bold">{s.value}</h2>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* 🔥 BED OCCUPANCY */}
        <Card title="Bed Occupancy" className="lg:col-span-2">
          <div className="p-5">

            {/* 🔥 TOP BOXES */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                ['Total Beds', totalBeds, 'blue'],
                ['Occupied', occupiedBeds, 'amber'],
                ['Available', availableBeds, 'green'],
                ['ICU', icuBeds ? `${icuOccupied}/${icuBeds}` : '0/0', 'rose']
              ].map(([k, v, c]) => {

                const colorMap = {
                  blue: 'bg-blue-50',
                  amber: 'bg-amber-50',
                  green: 'bg-green-50',
                  rose: 'bg-rose-50',
                };

                return (
                  <div key={k} className={`p-3 rounded-xl text-center ${colorMap[c]}`}>
                    <p className="text-xl font-bold">{v}</p>
                    <p className="text-xs text-slate-500">{k}</p>
                  </div>
                );
              })}
            </div>

            {/* 🔥 ROOM LIST */}
            <div className="space-y-2">
              {rooms.map(r => {

                const status = r.occupied >= r.beds ? "Full" : "Available";

                return (
                  <div key={r.number} className="flex items-center gap-3">

                    <span className="text-xs font-mono w-16">{r.number}</span>
                    <span className="text-xs w-20">{r.type}</span>

                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${status === 'Full' ? 'bg-rose-400' : 'bg-emerald-400'}`}
                        style={{
                          width: r.beds ? `${(r.occupied / r.beds) * 100}%` : "0%"
                        }}
                      />
                    </div>

                    <span className="text-xs w-10">
                      {r.occupied}/{r.beds}
                    </span>

                    <Badge variant={status === 'Full' ? 'red' : 'green'}>
                      {status}
                    </Badge>

                  </div>
                );
              })}
            </div>

          </div>
        </Card>

        {/* 🔥 RECENT ADMISSIONS */}
        <Card title="Recent Admissions">
          <div className="p-4 space-y-3">
            {patients.map(p => (
              <div key={p._id} className="flex items-center gap-3 py-2 border-b">

                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                  {p.patientId?.slice(-2)}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.patientId}</p>
                  <p className="text-xs text-slate-400">
                    {p.roomNumber} · {new Date(p.admissionDate).toLocaleDateString()}
                  </p>
                </div>

                <Badge variant="green">Admitted</Badge>

              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);


  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phone: ""
  });

  // 🔥 Fetch staff users
  useEffect(() => {
    fetch("http://localhost:5000/api/staff")
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(data => {
        console.log("Users:", data);
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        setUsers([]);
      });
  }, []);
  const addUser = async () => {
    if (!newUser.fullname || !newUser.email || !newUser.password || !newUser.role) {
      alert("Fill all fields ❌");
      return;
    }

    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("User added ✅");

    // 🔥 update UI instantly
    setUsers(prev => [...prev, {
      ...newUser,
      customId: data.user.id,
      _id: Date.now()
    }]);

    // reset form
    setNewUser({
      fullname: "",
      email: "",
      password: "",
      role: "",
      phone: ""
    });

    setShow(false);
  };
  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/api/user/${id}`, {
      method: "DELETE"
    });

    setUsers(prev => prev.filter(u => u._id !== id));
  };
  return (
    <div>
      <SectionHeader
        title="User Management"
        action={
          <button className="btn-primary" onClick={() => setShow(true)}>
            + Add User
          </button>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <Table headers={['ID', 'Name', 'Email', 'Role', 'Phone', 'Action']}>

            {users.map(user => (
              <tr key={user._id} className="border-b hover:bg-slate-50 transition">

                <td className="px-4 py-3">{user.customId}</td>
                <td className="px-4 py-3 font-medium">{user.fullname}</td>
                <td className="px-4 py-3">{user.email}</td>

                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                    {user.role}
                  </span>
                </td>

                <td className="px-4 py-3">{user.phone}</td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200"
                  >
                    Remove
                  </button>
                </td>

              </tr>
            ))}

          </Table>
          {show && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

                <h2 className="text-lg font-semibold mb-4">Add New User</h2>

                <div className="flex flex-col gap-3">

                  <input
                    placeholder="Full Name"
                    className="border p-2 rounded"
                    value={newUser.fullname}
                    onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                  />

                  <input
                    placeholder="Email"
                    className="border p-2 rounded"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />

                  <input
                    placeholder="Password"
                    type="password"
                    className="border p-2 rounded"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />

                  <select
                    className="border p-2 rounded"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="">Select Role</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="lab">Lab</option>
                    <option value="pharmacy">Pharmacy</option>
                  </select>

                  <input
                    placeholder="Phone"
                    className="border p-2 rounded"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />

                </div>

                <div className="flex justify-end gap-2 mt-5">

                  <button
                    onClick={() => setShow(false)}
                    className="px-4 py-2 rounded bg-gray-200"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={addUser}
                    className="px-4 py-2 rounded bg-blue-500 text-white"
                  >
                    Add
                  </button>

                </div>

              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export function PatientManagement() {
  const [forms, setForms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admission-form")
      .then(res => res.json())
      .then(setForms);

    fetch("http://localhost:5000/api/doctors")
      .then(res => res.json())
      .then(setDoctors);

    fetch("http://localhost:5000/api/rooms")
      .then(res => res.json())
      .then(setRooms);
  }, []);
  const approve = async (form) => {
    if (!form.selectedDoctor) {
      alert("Select doctor ❌");
      return;
    }

    if (!form.selectedRoom) {
      alert("Select room ❌");
      return;
    }

    await fetch(`http://localhost:5000/api/admission/approve/${form._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        doctorId: form.selectedDoctor,
        roomNumber: form.selectedRoom
      })
    });

    alert("Approved ✅");

    setForms(prev =>
      prev.map(f =>
        f._id === form._id
          ? {
            ...f,
            status: "approved",
            selectedDoctor: form.selectedDoctor,
            selectedRoom: form.selectedRoom
          }
          : f
      )
    );
  };
  const cancelAdmission = async (form) => {
    await fetch(`http://localhost:5000/api/admission/cancel/${form._id}`, {
      method: "POST"
    });

    alert("Cancelled ❌");

    // ✅ IF YOU DELETE FORM → remove from UI
    setForms(prev => prev.filter(f => f._id !== form._id));
  };
  return (
    <div>
      <SectionHeader title="Patient Management" action={<button className="btn-primary flex items-center gap-2"><Plus size={14} /> New Admission</button>} />
      <Card>
        <div className="overflow-x-auto">
          <Table headers={['Patient ID', 'Name', 'Age', 'Room', 'Doctor', 'Diagnosis', 'Status', 'Action']}>

            {forms.map(form => (
              <tr key={form._id} className="border-b hover:bg-slate-50 transition">

                {/* Patient ID */}
                <td className="px-4 py-3">{form.patientId}</td>

                {/* Name */}
                <td className="px-4 py-3 font-medium">{form.fullname}</td>

                {/* Age */}
                <td className="px-4 py-3">{form.age}</td>

                {/* Room */}
                <td className="px-4 py-3">
                  {form.status === "approved" ? (
                    <span className="text-blue-600 font-medium">
                      {form.selectedRoom}
                    </span>
                  ) : (
                    <select
                      className="border rounded-md px-2 py-1 text-sm w-36"
                      value={form.selectedRoom || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForms(prev =>
                          prev.map(f =>
                            f._id === form._id ? { ...f, selectedRoom: value } : f
                          )
                        );
                      }}
                    >
                      <option value="">Select</option>

                      {rooms.map(room => {
                        const isFull = room.occupied >= room.beds;

                        return (
                          <option
                            key={room.number}
                            value={room.number}
                            disabled={isFull}   // 🔥 prevent full rooms
                          >
                            {room.number} ({room.type}) {isFull ? "❌ Full" : ""}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </td>

                {/* Doctor */}
                <td className="px-4 py-3">
                  {form.status === "approved" ? (
                    <span className="text-purple-600 font-medium">
                      {form.selectedDoctor}
                    </span>
                  ) : (
                    <select
                      className="border rounded-md px-2 py-1 text-sm w-32"
                      onChange={(e) => form.selectedDoctor = e.target.value}
                    >
                      <option value="">Select</option>
                      {doctors.map(doc => (
                        <option key={doc.customId} value={doc.customId}>
                          {doc.fullname}
                        </option>
                      ))}
                    </select>
                  )}
                </td>

                {/* Diagnosis */}
                <td className="px-4 py-3">{form.chiefComplaint}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${form.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                      }`}
                  >
                    {form.status || "pending"}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  {form.status === "approved" ? (
                    <button
                      onClick={() => cancelAdmission(form)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => approve(form)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Approve
                    </button>
                  )}
                </td>

              </tr>
            ))}

          </Table>
        </div>
      </Card>
    </div>
  );
}

export function RoomManagement() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then(res => res.json())
      .then(setRooms);
  }, []);
  return (
    <div>
      <SectionHeader title="Room Management" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {rooms.map(r => {
          const status = r.occupied >= r.beds ? "Full" : "Available";

          return (
            <Card key={r.number} className="p-4">

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold">{r.number}</span>
                  <span className="ml-2 text-xs text-slate-400">{r.type}</span>
                </div>

                <Badge variant={status === 'Full' ? 'red' : 'green'}>
                  {status}
                </Badge>
              </div>

              <div className="h-2 rounded-full bg-slate-100 mb-3 overflow-hidden">
                <div
                  className={`h-full ${status === 'Full' ? 'bg-rose-400' : 'bg-emerald-400'}`}
                  style={{
                    width: r.beds ? `${(r.occupied / r.beds) * 100}%` : "0%"
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>{r.occupied} of {r.beds} beds occupied</span>

                <button className="text-blue-500 hover:text-blue-600 font-semibold">
                  Manage
                </button>
              </div>

            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function ChargesManagement() {
  return (
    <div>
      <SectionHeader title="Charges Management" action={<button className="btn-primary flex items-center gap-2"><Plus size={14} /> Add Charge</button>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {['Room', 'Test', 'Consultation'].map(type => (
          <Card key={type} title={`${type} Charges`}>
            <div className="p-4 space-y-2">
              {charges.filter(c => c.type === type).map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700/30 last:border-0">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹{c.amount}</span>
                    <button className="text-blue-500 p-1"><Edit3 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminReports() {
  const logs = [
    { time: '10:32 AM', action: 'New patient admitted', user: 'Admin', detail: 'Kavya Reddy → Room 101-A' },
    { time: '10:15 AM', action: 'Prescription issued', user: 'Dr. Rohan Verma', detail: 'Aarav Mehta · RX001' },
    { time: '09:50 AM', action: 'Vitals recorded', user: 'Priya Sharma', detail: 'Neha Gupta · SPO2: 96%' },
    { time: '09:30 AM', action: 'Lab test completed', user: 'Sneha Joshi', detail: 'HbA1c · Ramesh Joshi' },
    { time: '09:10 AM', action: 'Medicine dispensed', user: 'Karan Patel', detail: 'Amoxicillin 500mg × 14' },
    { time: '08:45 AM', action: 'Staff login', user: 'Dr. Anjali Nair', detail: 'Doctor Dashboard' },
  ];

  return (
    <div>
      <SectionHeader title="Activity Logs" />
      <Card>
        <div className="p-5">
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-700" />
            <div className="space-y-4">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-white dark:border-slate-800 flex items-center justify-center z-10 shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{log.action}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{log.detail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-mono">{log.time}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{log.user}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
