import React from 'react';
import { StatCard, Card, Table, Badge, FormField, Input, Select, SectionHeader } from '../../components/ui';
import { Package, FileText, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { prescriptions, inventory } from '../../data/mockData';

export function PharmacyDashboard() {
  return (
    <div>
      <SectionHeader title="Pharmacy Dashboard" subtitle="Manage prescriptions and inventory" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Pending Rx" value="3" icon={FileText} color="amber" />
        <StatCard title="Dispensed Today" value="12" icon={CheckCircle} color="green" />
        <StatCard title="Low Stock Items" value="2" icon={AlertTriangle} color="rose" />
        <StatCard title="Total Billed" value="₹18,450" icon={CreditCard} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Pending Prescriptions">
          <div className="p-4 space-y-3">
            {prescriptions.map(rx => (
              <div key={rx.id} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-center gap-3">
                <FileText size={16} className="text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rx.patientName}</p>
                  <p className="text-xs text-slate-500">{rx.medicines.length} medicines · {rx.doctor}</p>
                </div>
                <button className="btn-primary py-1.5 text-xs">Dispense</button>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Stock Alerts">
          <div className="p-4 space-y-3">
            {inventory.filter(i => i.status !== 'In Stock').map(item => (
              <div key={item.id} className={`p-3 rounded-xl border flex items-center gap-3 ${
                item.status === 'Critical' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20'
              }`}>
                <AlertTriangle size={16} className={item.status === 'Critical' ? 'text-red-500' : 'text-amber-500'} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                  <p className="text-xs text-slate-500">Stock: {item.stock} {item.unit} (Reorder: {item.reorder})</p>
                </div>
                <Badge variant={item.status === 'Critical' ? 'red' : 'yellow'}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function PharmacyPrescriptions() {
  return (
    <div>
      <SectionHeader title="Prescriptions" />
      <Card>
        <Table headers={['Rx ID', 'Patient', 'Doctor', 'Medicines', 'Date', 'Status', 'Action']}>
          {prescriptions.map(rx => (
            <tr key={rx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <td className="table-cell font-mono text-xs text-slate-500">{rx.id}</td>
              <td className="table-cell">
                <div>
                  <p className="font-semibold text-sm">{rx.patientName}</p>
                  <p className="text-xs text-slate-400">{rx.patientId}</p>
                </div>
              </td>
              <td className="table-cell text-slate-500 text-sm">{rx.doctor}</td>
              <td className="table-cell">
                <div className="space-y-0.5">
                  {rx.medicines.map((m, i) => (
                    <p key={i} className="text-xs text-slate-600 dark:text-slate-300">{m.name} · {m.dosage}</p>
                  ))}
                </div>
              </td>
              <td className="table-cell text-slate-400 text-xs">{rx.date}</td>
              <td className="table-cell"><Badge variant="yellow">Pending</Badge></td>
              <td className="table-cell">
                <button className="btn-primary py-1.5 text-xs">Mark Dispensed</button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function MedicineInventory() {
  return (
    <div>
      <SectionHeader
        title="Medicine Inventory"
        action={<button className="btn-primary">+ Add Medicine</button>}
      />
      <Card>
        <Table headers={['Medicine', 'Category', 'Stock', 'Unit', 'Reorder Level', 'Expiry', 'Status', 'Actions']}>
          {inventory.map(item => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <td className="table-cell font-semibold">{item.name}</td>
              <td className="table-cell text-slate-500 text-xs">{item.category}</td>
              <td className="table-cell font-mono font-bold">{item.stock}</td>
              <td className="table-cell text-slate-500 text-xs">{item.unit}</td>
              <td className="table-cell font-mono text-xs text-slate-400">{item.reorder}</td>
              <td className="table-cell text-xs text-slate-400">{item.expiry}</td>
              <td className="table-cell">
                <Badge variant={item.status === 'In Stock' ? 'green' : item.status === 'Low Stock' ? 'yellow' : 'red'}>{item.status}</Badge>
              </td>
              <td className="table-cell">
                <button className="text-pulse-500 text-xs font-semibold">Update</button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function PharmacyBilling() {
  const billItems = [
    { id: 'PB001', patient: 'Aarav Mehta', pid: 'PT-20041', medicine: 'Amoxicillin 500mg × 14', qty: 14, amount: 560, status: 'Paid' },
    { id: 'PB002', patient: 'Neha Gupta', pid: 'PT-20042', medicine: 'Paracetamol 650mg × 10', qty: 10, amount: 220, status: 'Paid' },
    { id: 'PB003', patient: 'Ramesh Joshi', pid: 'PT-20043', medicine: 'Metformin 500mg × 30', qty: 30, amount: 390, status: 'Pending' },
  ];

  return (
    <div>
      <SectionHeader title="Pharmacy Billing" />
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard title="Total Billed" value="₹1,170" icon={CreditCard} color="blue" />
        <StatCard title="Collected" value="₹780" icon={CheckCircle} color="green" />
        <StatCard title="Pending" value="₹390" icon={AlertTriangle} color="amber" />
      </div>
      <Card>
        <Table headers={['Bill ID', 'Patient', 'Medicine', 'Qty', 'Amount', 'Status', 'Action']}>
          {billItems.map(b => (
            <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <td className="table-cell font-mono text-xs">{b.id}</td>
              <td className="table-cell">
                <p className="font-semibold text-sm">{b.patient}</p>
                <p className="text-xs text-slate-400">{b.pid}</p>
              </td>
              <td className="table-cell text-sm">{b.medicine}</td>
              <td className="table-cell font-mono">{b.qty}</td>
              <td className="table-cell font-mono font-bold">₹{b.amount}</td>
              <td className="table-cell"><Badge variant={b.status === 'Paid' ? 'green' : 'yellow'}>{b.status}</Badge></td>
              <td className="table-cell">
                {b.status === 'Pending' && <button className="btn-primary py-1.5 text-xs">Collect</button>}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
