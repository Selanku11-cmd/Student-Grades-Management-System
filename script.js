'use strict';
// Replace this URL with your public GitHub repository URL before submitting.
const GITHUB_REPO_URL = 'https://github.com/Selanku11-cmd/Student-Grades-Management-System';
const STORAGE_KEY = 'arraygrade_students_v1';
const sampleStudents = [
  { id: 1001, name: 'Ama Mensah', score: 85 },
  { id: 1002, name: 'Kojo Asante', score: 72 },
  { id: 1003, name: 'Abigail Owusu', score: 90 },
  { id: 1004, name: 'Daniel Boateng', score: 65 },
  { id: 1005, name: 'Sarah Addo', score: 78 }
];
function loadStudents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return sampleStudents.map(student => ({ ...student }));
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error('Invalid stored data');
    return parsed.filter(s => s && Number.isSafeInteger(s.id) && typeof s.name === 'string' && Number.isInteger(s.score) && s.score >= 0 && s.score <= 100);
  } catch (error) {
    console.warn('Unable to load saved records:', error);
    return sampleStudents.map(student => ({ ...student }));
  }
}
let students = loadStudents(); // The main data structure: an array of objects.
let nextId = Math.max(1000, ...students.map(s => s.id)) + 1;
let editingId = null;
let selectedId = null;
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const grade = score => score >= 80 ? 'A' : score >= 75 ? 'B+' : score >= 70 ? 'B' : score >= 65 ? 'C+' : score >= 60 ? 'C' : score >= 55 ? 'D+' : score >= 50 ? 'D' : 'F';
const gradeClass = g => ['A','B+','B'].includes(g) ? '' : ['C+','C','D+'].includes(g) ? 'mid' : 'low';
function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); } catch (e) { toast('Storage unavailable: changes may not persist.'); } }
function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toast.timeout); toast.timeout = setTimeout(() => el.classList.remove('show'), 3300); }
function log(message) { $('operationLog').textContent = message; }
function studentRow(s, i, actions) {
  const g = grade(s.score);
  return `<tr>${actions ? `<td><code>[${i}]</code></td>` : ''}<td>#${s.id}</td><td class="student-name">${escapeHTML(s.name)}</td><td>${s.score}/100</td><td><span class="grade ${gradeClass(g)}">${g}</span></td>${actions ? `<td><button class="action-btn" data-edit="${s.id}">Edit</button><button class="action-btn danger" data-delete="${s.id}">Delete</button></td>` : ''}</tr>`;
}
function renderDashboard() {
  const count = students.length;
  const total = students.reduce((sum, s) => sum + s.score, 0);
  $('statTotal').textContent = count;
  $('statAverage').textContent = count ? (total / count).toFixed(1) + '%' : '—';
  $('statHigh').textContent = count ? Math.max(...students.map(s => s.score)) + '%' : '—';
  $('statLow').textContent = count ? Math.min(...students.map(s => s.score)) + '%' : '—';
  $('recentRows').innerHTML = count ? students.slice(-5).reverse().map(s => studentRow(s, 0, false)).join('') : '<tr><td colspan="4" class="empty">No students yet. Add your first student.</td></tr>';
  const labels = ['A','B+','B','C+','C','D+','D','F'];
  const counts = labels.map(g => students.filter(s => grade(s.score) === g).length);
  const max = Math.max(1, ...counts);
  $('gradeChart').innerHTML = labels.map((g,i) => `<div class="chart-col"><strong>${counts[i]}</strong><div class="bar" style="height:${Math.max(3, counts[i] / max * 140)}px"></div><span>${g}</span></div>`).join('');
}
function renderStudents() {
  const q = $('studentSearch').value.trim().toLowerCase();
  // filter() searches the array without changing it; map() builds table rows.
  const filtered = students.map((student, index) => ({ student, index })).filter(({student}) => student.name.toLowerCase().includes(q) || String(student.id).includes(q));
  $('recordCount').textContent = `${filtered.length} of ${students.length} records`;
  $('studentRows').innerHTML = filtered.length ? filtered.map(({student,index}) => studentRow(student,index,true)).join('') : '<tr><td colspan="6" class="empty">No matching students found.</td></tr>';
}
function renderArray() {
  $('arrayLength').textContent = `length: ${students.length}`;
  $('arrayCards').innerHTML = students.length ? students.map((s,i) => `<button class="array-card ${s.id === selectedId ? 'selected' : ''}" data-select="${s.id}"><span class="index">students[${i}]</span><span class="data"><strong>${escapeHTML(s.name)}</strong><br/>Score: ${s.score} · ${grade(s.score)}</span></button>`).join('') : '<p class="muted">The array is empty. Add a student to see elements here.</p>';
  const s = students.find(item => item.id === selectedId);
  $('selectedRecord').textContent = s ? `students[${students.indexOf(s)}] = ${JSON.stringify(s, null, 2)}` : 'Select an element to inspect it.';
}
function renderAll() { renderDashboard(); renderStudents(); renderArray(); }
function openForm(id = null) {
  editingId = id;
  $('studentForm').reset(); $('formError').textContent = '';
  const s = students.find(student => student.id === id);
  $('modalTitle').textContent = s ? 'Edit Student' : 'Add Student';
  $('submitStudent').textContent = s ? 'Save Changes' : 'Save Student';
  if (s) { $('nameInput').value = s.name; $('scoreInput').value = s.score; }
  $('studentDialog').showModal(); $('nameInput').focus();
}
function closeForm() { $('studentDialog').close(); editingId = null; }
$('studentForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('nameInput').value.trim();
  const rawScore = $('scoreInput').value.trim();
  const score = Number(rawScore);
  if (!name || name.length > 80 || rawScore === '' || !Number.isInteger(score) || score < 0 || score > 100) {
    $('formError').textContent = 'Enter a name and a whole-number score between 0 and 100.'; return;
  }
  if (editingId !== null) {
    const s = students.find(student => student.id === editingId); // find() locates a record.
    if (s) { s.name = name; s.score = score; log(`Updated student #${s.id} using array element access.`); }
    toast('Student updated successfully.');
  } else {
    const s = { id: nextId++, name, score };
    students.push(s); // push() inserts at the end of the array.
    log(`push(): Added ${name} at students[${students.length - 1}].`);
    toast('Student added successfully.');
  }
  persist(); renderAll(); closeForm();
});
$('studentRows').addEventListener('click', event => {
  const edit = event.target.closest('[data-edit]');
  const del = event.target.closest('[data-delete]');
  if (edit) openForm(Number(edit.dataset.edit));
  if (del) {
    const id = Number(del.dataset.delete);
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return;
    if (!confirm(`Delete ${students[index].name}'s record?`)) return;
    const [removed] = students.splice(index, 1); // splice() removes one array element.
    if (selectedId === removed.id) selectedId = null;
    log(`splice(${index}, 1): Removed ${removed.name}.`);
    persist(); renderAll(); toast('Student deleted.');
  }
});
$('arrayCards').addEventListener('click', event => { const card = event.target.closest('[data-select]'); if (!card) return; selectedId = Number(card.dataset.select); renderArray(); });
$('studentSearch').addEventListener('input', renderStudents);
$('popButton').addEventListener('click', () => {
  if (!students.length) return toast('The array is already empty.');
  const s = students[students.length - 1];
  if (!confirm(`Remove the last student, ${s.name}?`)) return;
  students.pop(); if (selectedId === s.id) selectedId = null;
  log(`pop(): Removed ${s.name} from the end of the array.`);
  persist(); renderAll(); toast('Last element removed.');
});
$('sortButton').addEventListener('click', () => { students.sort((a,b) => b.score - a.score); log('sort(): Arranged students from highest to lowest score.'); persist(); renderAll(); toast('Sorted by score.'); });
$('reverseButton').addEventListener('click', () => { students.reverse(); log('reverse(): Reversed the order of array elements.'); persist(); renderAll(); toast('Array order reversed.'); });
function navigate(page) {
  if (!['dashboard','students','arrays','learn'].includes(page)) page = 'dashboard';
  document.querySelectorAll('.view').forEach(el => el.classList.toggle('hidden', el.id !== page));
  document.querySelectorAll('.nav-link').forEach(el => el.classList.toggle('active', el.dataset.view === page));
  $('currentPage').textContent = ({dashboard:'Dashboard',students:'Student Records',arrays:'Array Explorer',learn:'About Arrays'})[page];
  window.scrollTo({top:0,behavior:'instant'});
}
window.addEventListener('hashchange', () => navigate(location.hash.slice(1)));
document.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => { location.hash = el.dataset.go; }));
document.querySelectorAll('[data-open-modal]').forEach(el => el.addEventListener('click', () => openForm()));
$('closeDialog').addEventListener('click', closeForm);
$('cancelDialog').addEventListener('click', closeForm);
$('studentDialog').addEventListener('click', event => { if (event.target === $('studentDialog')) closeForm(); });
$('githubLink').href = GITHUB_REPO_URL;
renderAll(); navigate(location.hash.slice(1));
