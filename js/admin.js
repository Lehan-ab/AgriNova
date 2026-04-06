document.addEventListener('DOMContentLoaded', async () => {
    const table = document.getElementById('moderationTable');
    const pendingCount = document.getElementById('pendingCount');
    const emptyState = document.getElementById('emptyAdminState');

    // Only allow admin
    const currentUser = JSON.parse(localStorage.getItem('agrinova_user'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    async function loadQueue() {
        if (!table) return;

        let suppliers = await db.suppliers.where('verified').equals(0).toArray();
        pendingCount.textContent = suppliers.length;

        if (suppliers.length === 0) {
            table.parentElement.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        table.parentElement.classList.remove('hidden');
        emptyState.classList.add('hidden');

        table.innerHTML = suppliers.map(s => `
            <tr class="bg-white hover:bg-slate-50 transition border-b border-slate-100">
                <td class="p-4 font-semibold text-slate-800">${s.name}</td>
                <td class="p-4"><span class="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">${s.category}</span></td>
                <td class="p-4 text-slate-600">${s.location}</td>
                <td class="p-4">
                    <span class="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">Awaiting Review</span>
                </td>
                <td class="p-4 text-right">
                    <button class="approve-btn text-success border border-success hover:bg-success hover:text-white px-3 py-1.5 rounded text-xs font-bold transition mr-1" data-id="${s.id}">Approve</button>
                    <button class="reject-btn text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition" data-id="${s.id}">Reject</button>
                </td>
            </tr>
        `).join('');

        attachListeners();
    }

    function attachListeners() {
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.dataset.id);
                await db.suppliers.update(id, { verified: true });
                showToast('Supplier verified successfully.', 'success');
                loadQueue(); // refresh
            });
        });

        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.dataset.id);
                // In a real app we might soft-delete or flag. Here we just remove.
                await db.suppliers.delete(id);
                showToast('Supplier request rejected.', 'error');
                loadQueue();
            });
        });
    }

    loadQueue();
});
