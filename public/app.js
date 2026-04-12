const API_URL = '/api/students';

const studentForm = document.getElementById('studentForm');
const studentIdInput = document.getElementById('studentId');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const emailInput = document.getElementById('email');
const teamInput = document.getElementById('team');
const studentsTableBody = document.getElementById('studentsTableBody');
const messageElement = document.getElementById('message');
const formTitle = document.getElementById('formTitle');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resetSearchBtn = document.getElementById('resetSearchBtn');

function setMessage(text, type = '') {
  messageElement.textContent = text;
  messageElement.className = `message ${type}`.trim();
}

function resetForm() {
  studentForm.reset();
  studentIdInput.value = '';
  formTitle.textContent = 'Opret studerende';
  cancelEditBtn.hidden = true;
}

function fillForm(student) {
  studentIdInput.value = student._id;
  nameInput.value = student.name;
  ageInput.value = student.age;
  emailInput.value = student.email;
  teamInput.value = student.team;
  formTitle.textContent = 'Rediger studerende';
  cancelEditBtn.hidden = false;
}

function renderStudents(students) {
  studentsTableBody.innerHTML = '';

  if (students.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5">Ingen studerende fundet</td>';
    studentsTableBody.appendChild(row);
    return;
  }

  students.forEach((student) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.email}</td>
      <td>${student.team}</td>
      <td>
        <button type="button" data-action="edit" data-id="${student._id}">Rediger</button>
        <button type="button" data-action="delete" data-id="${student._id}" class="secondary">Slet</button>
      </td>
    `;

    studentsTableBody.appendChild(row);
  });
}

async function fetchStudents(query = '') {
  const url = query ? `${API_URL}?q=${encodeURIComponent(query)}` : API_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Kunne ikke hente studerende');
  }

  return response.json();
}

async function loadStudents() {
  try {
    const query = searchInput.value.trim();
    const students = await fetchStudents(query);
    renderStudents(students);
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

async function createStudent(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Kunne ikke oprette studerende');
  }
}

async function updateStudent(id, payload) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Kunne ikke opdatere studerende');
  }
}

async function deleteStudent(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Kunne ikke slette studerende');
  }
}

studentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    age: Number(ageInput.value),
    email: emailInput.value.trim(),
    team: teamInput.value.trim(),
  };

  try {
    const id = studentIdInput.value;

    if (id) {
      await updateStudent(id, payload);
      setMessage('Studerende opdateret', 'success');
    } else {
      await createStudent(payload);
      setMessage('Studerende oprettet', 'success');
    }

    resetForm();
    await loadStudents();
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

cancelEditBtn.addEventListener('click', () => {
  resetForm();
  setMessage('Redigering annulleret');
});

studentsTableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'edit') {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Kunne ikke hente studerende');
      }

      const student = await response.json();
      fillForm(student);
      setMessage('Redigeringstilstand aktiv');
    } catch (error) {
      setMessage(error.message, 'error');
    }
    return;
  }

  if (action === 'delete') {
    const confirmed = window.confirm('Er du sikker på, at du vil slette denne studerende?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteStudent(id);
      setMessage('Studerende slettet', 'success');
      if (studentIdInput.value === id) {
        resetForm();
      }
      await loadStudents();
    } catch (error) {
      setMessage(error.message, 'error');
    }
  }
});

searchBtn.addEventListener('click', async () => {
  await loadStudents();
});

resetSearchBtn.addEventListener('click', async () => {
  searchInput.value = '';
  await loadStudents();
});

loadStudents();
