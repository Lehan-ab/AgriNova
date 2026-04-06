document.addEventListener('DOMContentLoaded', async () => {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsCount = document.getElementById('resultsCount');
    const searchInput = document.getElementById('searchInput');
    const locationInput = document.getElementById('locationInput');
    const searchForm = document.getElementById('searchForm');

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q') || '';
    const initialCat = urlParams.get('cat') || '';

    if (initialQuery) searchInput.value = initialQuery;

    // Automatically check checkboxes based on category param
    if (initialCat) {
        const cb = document.querySelector(`input[value="${initialCat}"]`);
        if (cb) cb.checked = true;
    }

    async function fetchAndRenderResults() {
        if (!resultsContainer) return;

        // Get filter values
        const q = searchInput.value.toLowerCase();
        const loc = locationInput.value;
        const verifiedOnly = document.getElementById('verifiedOnly').checked;
        const checkedCats = Array.from(document.querySelectorAll('#categoryFilters input:checked')).map(cb => cb.value);

        // Fetch from Dexie
        let suppliers = await db.suppliers.toArray();

        // Apply Logic Filters
        suppliers = suppliers.filter(s => {
            const matchesQuery = s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
            const matchesLoc = loc ? s.location === loc : true;
            const matchesVer = verifiedOnly ? s.verified === true : true;
            const matchesCat = checkedCats.length > 0 ? checkedCats.includes(s.category) : true;
            return matchesQuery && matchesLoc && matchesVer && matchesCat;
        });

        // Render
        resultsCount.textContent = `${suppliers.length} services found`;

        if (suppliers.length === 0) {
            resultsContainer.innerHTML = `
                <div class="bg-white p-10 rounded-xl border border-gray-200 text-center shadow-sm">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl text-gray-400 mx-auto mb-4">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">No results found</h3>
                    <p class="text-gray-500">Try adjusting your filters or search term to find what you need.</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = suppliers.map(s => `
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition flex flex-col md:flex-row gap-5 items-start fade-in">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0">
                    <i class="fas ${getIconForCategory(s.category)}"></i>
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-start gap-4">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                                ${s.name} ${s.verified ? '<i class="fas fa-check-circle text-blue-500 text-sm" title="Verified"></i>' : ''}
                            </h3>
                            <div class="flex flex-wrap gap-3 mt-1 text-xs font-semibold text-gray-600">
                                <span class="bg-gray-100 px-2 py-1 rounded-md"><i class="fas fa-map-marker-alt text-primary mr-1"></i> ${s.location}</span>
                                <span class="bg-gray-100 px-2 py-1 rounded-md"><i class="fas fa-tag text-primary mr-1"></i> ${s.category}</span>
                                <span class="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md"><i class="fas fa-star text-accent mr-1"></i> ${s.rating} (${s.reviews} reviews)</span>
                            </div>
                        </div>
                        <div class="hidden md:block">
                            <button onclick="window.location.href='supplier-profile.html?id=${s.id}'" class="px-5 py-2 bg-white border border-primary text-primary font-bold rounded-lg hover:bg-emerald-50 transition shadow-sm whitespace-nowrap">View Profile</button>
                        </div>
                    </div>
                    <p class="mt-3 text-sm text-gray-600 line-clamp-2">${s.description}</p>
                    <div class="md:hidden mt-4 w-full">
                        <button onclick="window.location.href='supplier-profile.html?id=${s.id}'" class="w-full px-5 py-2.5 bg-primary text-white font-bold rounded-lg transition shadow-sm text-sm">View Profile</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Event listeners
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            fetchAndRenderResults();
        });
    }

    const filters = document.querySelectorAll('#categoryFilters input, #verifiedOnly, #locationInput');
    filters.forEach(f => f.addEventListener('change', fetchAndRenderResults));

    function getIconForCategory(cat) {
        switch (cat) {
            case 'Machinery': return 'fa-tractor';
            case 'Seeds': return 'fa-seedling';
            case 'Transport': return 'fa-truck';
            case 'Advisory': return 'fa-user-tie';
            default: return 'fa-box';
        }
    }

    // Initial render
    setTimeout(fetchAndRenderResults, 300); // Slight delay for realistic feel
});
