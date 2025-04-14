window.onload = async () => {
  const res = await fetch("/api/employees");
  const employees = await res.json();

  const list = document.getElementById("employeeList");
  list.innerHTML = employees.map(emp => `
    <form action="/api/employees/update" method="POST">
      <input type="hidden" name="id" value="${emp.id}">
      <input type="text" name="name" value="${emp.name}" required>
      <input type="text" name="role" value="${emp.role}" required>
      <input type="email" name="email" value="${emp.email}" required>
      <button type="submit">Update</button>
    </form>
    <form action="/api/employees/delete" method="POST" style="display:inline;">
      <input type="hidden" name="id" value="${emp.id}">
      <button type="submit">Delete</button>
    </form>
    <hr>
  `).join("");
};

  